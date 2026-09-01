#!/usr/bin/env node
// Renders the profile activity panel from the GitHub GraphQL API.
// Every figure in the output SVG is computed here; none is written by hand.

const USER = process.env.GH_USER || "Rexy-5097";
const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) throw new Error("GITHUB_TOKEN is required");

// Build artefacts and markup dialects are not authored code.
const NOT_AUTHORED = new Set([
  "Makefile", "CSS", "HTML", "Dockerfile", "Batchfile", "Procfile",
  "Mako", "Standard ML", "DTrace", "Verilog", "Nix", "SCSS", "Less",
]);

const THEMES = {
  dark: {
    bg: "#22272e", border: "#444c56", fg: "#adbac7", strong: "#cdd9e5",
    muted: "#768390", accent: "#539bf5",
    levels: ["#2d333b", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
  light: {
    bg: "#ffffff", border: "#d0d7de", fg: "#24292f", strong: "#1f2328",
    muted: "#57606a", accent: "#0969da",
    levels: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  },
};

const QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount weekday } }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 12) { edges { size node { name color } } }
      }
    }
  }
}`;

async function fetchData() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
  return json.data.user;
}

function languageShare(repos) {
  const bytes = new Map(), colors = new Map();
  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges) {
      if (NOT_AUTHORED.has(node.name)) continue;
      bytes.set(node.name, (bytes.get(node.name) || 0) + size);
      colors.set(node.name, node.color || "#8b949e");
    }
  }
  const total = [...bytes.values()].reduce((a, b) => a + b, 0);
  return [...bytes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, size]) => ({ name, pct: (size / total) * 100, color: colors.get(name) }));
}

const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
const fmt = (n) => n.toLocaleString("en-US");

function render(user, theme) {
  const t = THEMES[theme];
  const c = user.contributionsCollection;
  const cal = c.contributionCalendar;
  const repos = user.repositories.nodes;
  const stars = repos.reduce((a, r) => a + r.stargazerCount, 0);
  const langs = languageShare(repos);

  // Calendar geometry
  const CELL = 11, GAP = 3, PITCH = CELL + GAP;
  const weeks = cal.weeks;
  const calW = weeks.length * PITCH - GAP;
  // Intensity buckets are quartiles over days that saw any activity, so a
  // single outlier day cannot wash the rest of the year out to level 1.
  const active = weeks
    .flatMap((w) => w.contributionDays.map((d) => d.contributionCount))
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const q = (f) => active.length ? active[Math.min(active.length - 1, Math.floor(active.length * f))] : 1;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  const level = (n) => (n === 0 ? 0 : n > q3 ? 4 : n > q2 ? 3 : n > q1 ? 2 : 1);

  const W = 60 + calW, CAL_Y = 146;
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let lastMonth = -1, lastLabelCol = -99;
  const monthLabels = weeks
    .map((w, x) => {
      const first = w.contributionDays[0];
      if (!first) return "";
      const m = new Date(first.date).getUTCMonth();
      if (m === lastMonth) return "";
      lastMonth = m;
      // Needs room for the label itself and for the final column's month.
      if (x - lastLabelCol < 3 || x > weeks.length - 3) return "";
      lastLabelCol = x;
      return `<text x="${30 + x * PITCH}" y="${CAL_Y - 8}" class="label">${MONTHS[m]}</text>`;
    })
    .join("");
  const cells = weeks
    .map((w, x) =>
      w.contributionDays
        .map((d) => {
          const y = CAL_Y + d.weekday * PITCH;
          return `<rect x="${30 + x * PITCH}" y="${y}" width="${CELL}" height="${CELL}" rx="2" fill="${t.levels[level(d.contributionCount)]}"><title>${d.date}: ${d.contributionCount}</title></rect>`;
        })
        .join("")
    )
    .join("");

  const stats = [
    ["Contributions", cal.totalContributions],
    ["Commits", c.totalCommitContributions],
    ["Pull requests", c.totalPullRequestContributions],
    ["Repositories", user.repositories.totalCount],
    ["Stars", stars],
  ];
  const statCells = stats
    .map(([label, value], i) => {
      const x = 30 + i * ((W - 60) / stats.length);
      return `<text x="${x}" y="76" class="figure">${fmt(value)}</text>
      <text x="${x}" y="94" class="label">${esc(label)}</text>`;
    })
    .join("");

  // Stacked language bar
  const BAR_Y = CAL_Y + 7 * PITCH + 26, BAR_W = W - 60;
  let cursor = 30;
  const segments = langs
    .map((l) => {
      const w = (l.pct / 100) * BAR_W;
      const r = `<rect x="${cursor.toFixed(2)}" y="${BAR_Y}" width="${Math.max(w, 0).toFixed(2)}" height="8" fill="${l.color}"/>`;
      cursor += w;
      return r;
    })
    .join("");

  const COL = BAR_W / langs.length;
  const legend = langs
    .map((l, i) => {
      const lx = 30 + i * COL;
      return `<circle cx="${(lx + 4).toFixed(2)}" cy="${BAR_Y + 30}" r="4" fill="${l.color}"/>
      <text x="${(lx + 14).toFixed(2)}" y="${BAR_Y + 34}" class="label">${esc(l.name)} ${l.pct.toFixed(1)}%</text>`;
    })
    .join("");

  const H = BAR_Y + 62;
  const updated = new Date().toISOString().slice(0, 10);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub activity for ${esc(USER)}">
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, Sans-Serif; }
    .title  { font: 600 15px inherit; fill: ${t.strong}; }
    .meta   { font: 400 11px inherit; fill: ${t.muted}; }
    .figure { font: 600 22px inherit; fill: ${t.strong}; }
    .label  { font: 400 11px inherit; fill: ${t.muted}; }
    .rule   { stroke: ${t.border}; stroke-width: 1; }
  </style>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="6" fill="${t.bg}" stroke="${t.border}"/>
  <text x="30" y="38" class="title">Activity</text>
  <text x="${W - 30}" y="38" class="meta" text-anchor="end">computed ${updated} · last 12 months</text>
  <line x1="30" y1="52" x2="${W - 30}" y2="52" class="rule"/>
  ${statCells}
  <line x1="30" y1="112" x2="${W - 30}" y2="112" class="rule"/>
  ${monthLabels}
  ${cells}
  ${segments}
  ${legend}
</svg>
`;
}

const user = await fetchData();
const { mkdir, writeFile } = await import("node:fs/promises");
await mkdir("dist", { recursive: true });
for (const theme of ["dark", "light"]) {
  await writeFile(`dist/activity-${theme}.svg`, render(user, theme));
  console.log(`wrote dist/activity-${theme}.svg`);
}
