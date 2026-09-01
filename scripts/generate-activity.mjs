#!/usr/bin/env node
// Renders the profile activity dashboard from the GitHub GraphQL API.
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
    bg: "#22272e", panel: "#2d333b", border: "#444c56", fg: "#adbac7",
    strong: "#cdd9e5", muted: "#768390", accent: "#539bf5", alt: "#c69026",
    levels: ["#2d333b", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
  light: {
    bg: "#ffffff", panel: "#f6f8fa", border: "#d0d7de", fg: "#24292f",
    strong: "#1f2328", muted: "#57606a", accent: "#0969da", alt: "#9a6700",
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
      commitContributionsByRepository(maxRepositories: 25) {
        repository { name owner { login } }
        contributions { totalCount }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes { stargazerCount languages(first: 12) { edges { size node { name color } } } }
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

const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
const fmt = (n) => n.toLocaleString("en-US");
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function analyse(user) {
  const c = user.contributionsCollection;
  const days = c.contributionCalendar.weeks.flatMap((w) => w.contributionDays);

  // Streaks and cadence over the trailing year.
  let longest = 0, run = 0;
  for (const d of days) run = d.contributionCount > 0 ? (longest = Math.max(longest, ++run), run) : 0;
  const activeDays = days.filter((d) => d.contributionCount > 0).length;

  // Contributions bucketed by calendar month, oldest first.
  const byMonth = new Map();
  for (const d of days) {
    const key = d.date.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) || 0) + d.contributionCount);
  }
  const months = [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-12);

  // Commits per repository, flagging repositories owned by someone else.
  const repos = c.commitContributionsByRepository
    .map((r) => ({
      name: r.repository.name,
      commits: r.contributions.totalCount,
      external: r.repository.owner.login.toLowerCase() !== USER.toLowerCase(),
    }))
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 6);

  // Authored-language share across owned, non-fork repositories.
  const bytes = new Map(), colors = new Map();
  for (const repo of user.repositories.nodes) {
    for (const { size, node } of repo.languages.edges) {
      if (NOT_AUTHORED.has(node.name)) continue;
      bytes.set(node.name, (bytes.get(node.name) || 0) + size);
      colors.set(node.name, node.color || "#8b949e");
    }
  }
  const totalBytes = [...bytes.values()].reduce((a, b) => a + b, 0);
  const langs = [...bytes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, size]) => ({ name, pct: (size / totalBytes) * 100, color: colors.get(name) }));

  return {
    days, months, repos, langs, longest, activeDays,
    repoTouched: c.commitContributionsByRepository.length,
    totals: c.contributionCalendar.totalContributions,
    commits: c.totalCommitContributions,
    prs: c.totalPullRequestContributions,
    repoCount: user.repositories.totalCount,
    stars: user.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0),
    weeks: c.contributionCalendar.weeks,
  };
}

function render(a, theme) {
  const t = THEMES[theme];
  const PAD = 30, CELL = 11, GAP = 3, PITCH = CELL + GAP;
  const W = 2 * PAD + (a.weeks.length * PITCH - GAP);
  const INNER = W - 2 * PAD;
  const parts = [];
  const text = (x, y, cls, s, anchor) =>
    `<text x="${x}" y="${y}" class="${cls}"${anchor ? ` text-anchor="${anchor}"` : ""}>${esc(s)}</text>`;
  const rule = (y) => `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" class="rule"/>`;

  // ---- Header -------------------------------------------------------------
  parts.push(text(PAD, 38, "title", "Engineering Activity"));
  parts.push(text(W - PAD, 38, "meta", `computed ${new Date().toISOString().slice(0, 10)} · trailing 12 months`, "end"));
  parts.push(rule(52));

  // ---- Headline figures ---------------------------------------------------
  // Five columns, not six: star count is a popularity metric rather than an
  // engineering one, and dropping it gives every label room to breathe.
  const stats = [
    ["Contributions", a.totals], ["Commits", a.commits], ["Pull requests", a.prs],
    ["Active days", a.activeDays], ["Repos worked in", a.repoTouched],
  ];
  stats.forEach(([label, value], i) => {
    const x = PAD + i * (INNER / stats.length);
    parts.push(text(x, 78, "figure", typeof value === "number" ? fmt(value) : value));
    parts.push(text(x, 96, "label", label));
  });
  parts.push(rule(114));

  // ---- Contribution calendar ---------------------------------------------
  const CAL_Y = 148;
  const active = a.days.map((d) => d.contributionCount).filter((n) => n > 0).sort((x, y) => x - y);
  const q = (f) => (active.length ? active[Math.min(active.length - 1, Math.floor(active.length * f))] : 1);
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  const level = (n) => (n === 0 ? 0 : n > q3 ? 4 : n > q2 ? 3 : n > q1 ? 2 : 1);

  let lastMonth = -1, lastCol = -99;
  a.weeks.forEach((w, x) => {
    const first = w.contributionDays[0];
    if (!first) return;
    const m = new Date(first.date).getUTCMonth();
    if (m === lastMonth || x - lastCol < 3 || x > a.weeks.length - 3) return;
    lastMonth = m; lastCol = x;
    parts.push(text(PAD + x * PITCH, CAL_Y - 10, "label", MONTHS[m]));
  });
  a.weeks.forEach((w, x) => {
    for (const d of w.contributionDays) {
      parts.push(
        `<rect x="${PAD + x * PITCH}" y="${CAL_Y + d.weekday * PITCH}" width="${CELL}" height="${CELL}" rx="2" fill="${t.levels[level(d.contributionCount)]}"><title>${d.date}: ${d.contributionCount}</title></rect>`
      );
    }
  });
  const CAL_END = CAL_Y + 7 * PITCH;
  // Intensity key, mirroring GitHub's own Less/More scale.
  const keyX = W - PAD - 5 * PITCH - 74;
  parts.push(text(keyX, CAL_END + 22, "label", "Less"));
  t.levels.forEach((fill, i) =>
    parts.push(`<rect x="${keyX + 38 + i * PITCH}" y="${CAL_END + 13}" width="${CELL}" height="${CELL}" rx="2" fill="${fill}"/>`)
  );
  parts.push(text(W - PAD, CAL_END + 22, "label", "More", "end"));
  parts.push(rule(CAL_END + 40));

  // ---- Two analytic panels ------------------------------------------------
  const SEC = CAL_END + 68;
  const COL_W = (INNER - 30) / 2;
  const RIGHT_X = PAD + COL_W + 30;
  const CHART_H = 84;

  // Left: contributions by month.
  parts.push(text(PAD, SEC, "heading", "Contributions by month"));
  const peakMonth = Math.max(...a.months.map(([, v]) => v), 1);
  const bw = Math.min(24, (COL_W - (a.months.length - 1) * 6) / a.months.length);
  const step = (COL_W - bw) / Math.max(a.months.length - 1, 1);
  a.months.forEach(([key, value], i) => {
    const h = Math.max(2, (value / peakMonth) * CHART_H);
    const x = PAD + i * step;
    const y = SEC + 16 + CHART_H - h;
    parts.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${t.accent}" opacity="${value === peakMonth ? 1 : 0.62}"><title>${key}: ${value}</title></rect>`);
    parts.push(text(x + bw / 2, SEC + 16 + CHART_H + 14, "tick", MONTHS[+key.slice(5, 7) - 1][0], "middle"));
  });

  // Right: commits by repository, distinguishing other people's repositories.
  parts.push(text(RIGHT_X, SEC, "heading", "Commits by repository"));
  const peakRepo = Math.max(...a.repos.map((r) => r.commits), 1);
  const ROW = 17, NAME_W = 124, COUNT_W = 30;
  const barMax = COL_W - NAME_W - COUNT_W;
  a.repos.forEach((r, i) => {
    const y = SEC + 18 + i * ROW;
    const name = r.name.length > 19 ? r.name.slice(0, 18) + "…" : r.name;
    parts.push(text(RIGHT_X, y + 8, "tick", name));
    parts.push(`<rect x="${RIGHT_X + NAME_W}" y="${y}" width="${((r.commits / peakRepo) * barMax).toFixed(1)}" height="10" rx="2" fill="${r.external ? t.alt : t.accent}"><title>${esc(r.name)}: ${r.commits} commits</title></rect>`);
    parts.push(text(RIGHT_X + COL_W, y + 8, "tick", String(r.commits), "end"));
  });
  const externalCount = a.repos.filter((r) => r.external).length;
  if (externalCount) {
    const y = SEC + 18 + a.repos.length * ROW + 12;
    parts.push(`<rect x="${RIGHT_X}" y="${y - 8}" width="9" height="9" rx="2" fill="${t.alt}"/>`);
    parts.push(text(RIGHT_X + 15, y, "label", "repository owned by someone else"));
  }

  // ---- Language share -----------------------------------------------------
  const LANG_Y = SEC + 18 + Math.max(a.repos.length * ROW + 24, CHART_H + 34) + 26;
  parts.push(rule(LANG_Y - 24));
  parts.push(text(PAD, LANG_Y, "heading", "Language share, by authored bytes"));
  let cursor = PAD;
  for (const l of a.langs) {
    const w = (l.pct / 100) * INNER;
    parts.push(`<rect x="${cursor.toFixed(2)}" y="${LANG_Y + 12}" width="${w.toFixed(2)}" height="8" fill="${l.color}"><title>${esc(l.name)}: ${l.pct.toFixed(1)}%</title></rect>`);
    cursor += w;
  }
  const COL = INNER / a.langs.length;
  a.langs.forEach((l, i) => {
    const lx = PAD + i * COL;
    parts.push(`<circle cx="${(lx + 4).toFixed(1)}" cy="${LANG_Y + 42}" r="4" fill="${l.color}"/>`);
    parts.push(text(lx + 14, LANG_Y + 46, "label", `${l.name} ${l.pct.toFixed(1)}%`));
  });

  const H = LANG_Y + 68;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub engineering activity for ${esc(USER)}">
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, Sans-Serif; }
    .title   { font: 600 15px inherit; fill: ${t.strong}; }
    .heading { font: 600 12px inherit; fill: ${t.fg}; }
    .meta    { font: 400 11px inherit; fill: ${t.muted}; }
    .figure  { font: 600 22px inherit; fill: ${t.strong}; }
    .label   { font: 400 11px inherit; fill: ${t.muted}; }
    .tick    { font: 400 10px inherit; fill: ${t.muted}; }
    .rule    { stroke: ${t.border}; stroke-width: 1; }
  </style>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="6" fill="${t.bg}" stroke="${t.border}"/>
  ${parts.join("\n  ")}
</svg>
`;
}

const user = await fetchData();
const a = analyse(user);
const { mkdir, writeFile } = await import("node:fs/promises");
await mkdir("dist", { recursive: true });
for (const theme of ["dark", "light"]) {
  await writeFile(`dist/activity-${theme}.svg`, render(a, theme));
  console.log(`wrote dist/activity-${theme}.svg`);
}
