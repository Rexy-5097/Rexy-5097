<div align="center">

# Soumyadeb Tripathy

*Backend Systems · Distributed Computing · Applied AI*

**[Portfolio](https://proof-of-work-roan.vercel.app)** · **[LinkedIn](https://www.linkedin.com/in/soumyadeb-tripathy/)** · **[Email](mailto:soumyadeb043@gmail.com)**

</div>

<br/>

I build systems whose correctness is **checkable rather than asserted** — backend services that stay consistent under concurrency and partial failure, and research tooling where every published number traces back to a committed artifact.

That principle runs through the work below. A stock ledger that holds under concurrent purchases and retried requests. An architecture engine that attaches evidence, provenance and a confidence value to every edge it draws. A research platform where a CI gate fails the build if a rendered figure drifts from its source JSON. I'd rather publish a negative result at full weight than round a number up — AdityaNet's headline finding is that machine learning gave *no* operational benefit over a single threshold, and that is what its front page says.

Currently completing a B.Tech in Computer Science and Engineering at Lovely Professional University, working toward backend and AI systems engineering roles.

<div align="center">

[Focus](#focus) · [Tech Stack](#tech-stack) · [Selected Projects](#selected-projects) · [Additional Work](#additional-work) · [Research Interests](#research-interests) · [Activity](#activity)

</div>

---

## Focus

|  |  |  |
|---|---|---|
| Backend Engineering | Distributed Systems | Program Analysis |
| Applied Machine Learning | Privacy-Preserving Computation | LLM Security |

---

## Tech Stack

**Languages**

<img src="https://skillicons.dev/icons?i=rust,py,ts,go,js,c,cpp,solidity&theme=dark" alt="Languages" height="48"/>

**Backend & Systems**

<img src="https://skillicons.dev/icons?i=fastapi,nodejs,express,nextjs&theme=dark" alt="Backend" height="48"/>

![REST APIs](https://img.shields.io/badge/REST%20APIs-1f2328?style=flat-square)
![Async Queues](https://img.shields.io/badge/Async%20Queues-1f2328?style=flat-square)
![Row-Level Security](https://img.shields.io/badge/Row--Level%20Security-1f2328?style=flat-square)
![Linux Kernel Modules](https://img.shields.io/badge/Linux%20Kernel%20Modules-1f2328?style=flat-square)
![tree-sitter](https://img.shields.io/badge/tree--sitter-1f2328?style=flat-square)

**Data**

<img src="https://skillicons.dev/icons?i=postgres,redis,mongodb&theme=dark" alt="Databases" height="48"/>

![TimescaleDB](https://img.shields.io/badge/TimescaleDB-1f2328?style=flat-square)

**Infrastructure**

<img src="https://skillicons.dev/icons?i=docker,githubactions,linux,git,github&theme=dark" alt="Infrastructure" height="48"/>

**AI & Machine Learning**

<img src="https://skillicons.dev/icons?i=pytorch,sklearn&theme=dark" alt="AI & Machine Learning" height="48"/>

![Transformers](https://img.shields.io/badge/Transformers-1f2328?style=flat-square)
![LightGBM](https://img.shields.io/badge/LightGBM-1f2328?style=flat-square)
![LLM Engineering](https://img.shields.io/badge/LLM%20Engineering-1f2328?style=flat-square)
![Fully Homomorphic Encryption](https://img.shields.io/badge/Fully%20Homomorphic%20Encryption-1f2328?style=flat-square)
![Zero-Knowledge Proofs](https://img.shields.io/badge/Zero--Knowledge%20Proofs-1f2328?style=flat-square)

---

## Selected Projects

**[cartograph](https://github.com/Rexy-5097/cartograph)** — *active*
A local-first architectural intelligence engine that computes a symbol-level, cross-language graph of a codebase, and carries the evidence for every edge it draws. No language model ever proposes an edge.

`Rust` `tree-sitter` `petgraph`

- Resolves relationships **across** the stack, not within a single language: partial evaluation of dynamically constructed URLs, normalisation across four route-declaration dialects, and ORM model resolution join a TypeScript call site → HTTP boundary → Python handler → database table, with no shared symbol table between them.
- Benchmarked against seven pinned production repositories (Superset, PostHog, Zulip, Onyx, Airflow, AutoGPT, FastAPI full-stack) over 14,932 edges: **1 false positive among 11,221 independently verified edges**, `HttpCall` recall 0.907.
- The report leads with its own weakness — 24.9% of edges could not be verified from source, so every figure is stated as an upper bound, and confidence values are documented as uncalibrated priors that must not be thresholded as probabilities.

<br/>

**[FurnitureOps](https://github.com/Rexy-5097/FurnitureOps)**
Inventory management backend built around one hard constraint: stock counts must stay correct under concurrent purchases and retried requests.

`TypeScript` `Next.js` `Supabase/Postgres` `Redis`

- Purchases are enqueued rather than written synchronously onto a Redis-backed queue; a separate worker applies stock changes through a row-locking Postgres RPC, with retries, a circuit breaker, and a dead-letter queue.
- Row Level Security policies separate authenticated-read from admin-write at the database layer, not just in application code.

<br/>

**[AdityaNet](https://github.com/Rexy-5097/AdityaNet)**
A verifiable research platform over the Aditya-L1 solar X-ray archive (SoLEXS, HEL1OS), built so a sceptic can check every published number without trusting the prose.

`Python` `LightGBM` `Astro` `TypeScript`

- **No rendered figure is typed by a person.** Each resolves at build time from a committed JSON artifact, and a CI gate re-reads those artifacts from disk and fails the build if a single value drifts from its source. The dataset is frozen and digest-addressed: 7 canonical tables, 1,985 files, 569.3 MiB, spanning 2024-02-01 → 2026-06-17.
- The headline result is negative and published at full weight. On M/X-class flare nowcast, learned models (ROC-AUC 0.961–0.966) do not separate from a single count-rate threshold (0.954) — their confidence intervals overlap — and a trivial persistence baseline beats all of them at 0.982. The evaluation protocol was frozen before any model was fit.
- Evidence routes ship ~0 KB of JavaScript under a per-route byte budget enforced in CI, behind a strict hash-based CSP with no external origins.

<br/>

**[GEOFENCE-LLM](https://github.com/Rexy-5097/GEOFENCE-LLM)**
A jailbreak-detection layer for LLMs that inspects the model's internal hidden-state trajectory during generation, instead of classifying prompt text.

`Python` `PyTorch` `Transformers`

- Fail-closed control loop (signal extraction → state estimation → risk scoring → authority decision) modeled after a control-systems hypervisor, decoupled from any specific base model.
- Measured obfuscated-prompt recall of 0.66 at a 0.48 false-positive rate — published in the repo's own audit alongside the honest limitation that this makes it unsuitable as a standalone filter.

<br/>

**[Raptor-AI](https://github.com/Rexy-5097/Raptor-AI)**
A local-first, voice-activated AI agent for macOS: wake-word detection, on-device speech-to-text, tool-calling, and proactive system and network monitoring.

`Python` `FastAPI` `Faster-Whisper` `Groq`

- Six-layer architecture (perception → orchestration → execution → daemons → learning → presentation) with an explicit agent finite-state machine and a priority engine that adapts alert frequency from user feedback.
- Speech-to-text and TTS run locally; only LLM reasoning calls out to an external API.

<br/>

**[zkhealth-fhe](https://github.com/Rexy-5097/zkhealth-fhe)**
A privacy-preserving electronic health record platform on an FHE-capable EVM chain, where patients hold their own decryption keys.

`Solidity` `fhEVM` `Node.js` `Arweave`

- Client-side AES-256-GCM encryption before any data leaves the device; the on-chain registry stores only hashes and access grants, never plaintext or keys.
- Doctor access requires an explicit on-chain authorization signature from the patient, verified before proxy re-encryption.

---

## Additional Work

| Project | What it is | Stack |
|---|---|---|
| **[nexus-rtb-engine](https://github.com/Rexy-5097/nexus-rtb-engine)** | Real-time bidding engine for second-price auctions — CTR, CVR and clearing-price models feeding expected-value bids with market-adaptive shading, at 0.15 ms P99 in the request path. | `Python` `LightGBM` |
| **[DDSO](https://github.com/Rexy-5097/DDSO)** | Linux block-layer I/O scheduler that switches between FIFO, SSTF and BATCH at runtime from live seek-variance telemetry, with kernel tracepoints streamed to an observability dashboard. | `C` `Linux kernel` |
| **[ASTRA](https://github.com/Rexy-5097/ASTRA)** | Variable-star classification from TESS light curves. Metrics (78.17% accuracy, macro F1 0.7677) are recomputed from hash-locked checkpoints in the repo's own audit; the weakest class is flagged as not production-ready rather than omitted. | `PyTorch` |
| **[Helios-Dx](https://github.com/Rexy-5097/Helios-Dx)** | Capacity-matched ablation of variational quantum circuits vs. classical layers for FHE medical imaging. Found no significant quantum advantage, and reports it as a null result. | `PyTorch` `PennyLane` |
| **[ai-code-reviewer](https://github.com/Rexy-5097/ai_code_reviewer_Meta_Hackathon)** | Reinforcement-learning environment for automated code review with structured actions and rewards, built on OpenEnv for the Meta Hackathon. | `Python` `FastAPI` |

---

## Research Interests

- Distributed systems and correctness under concurrent or partial failure
- Static and semantic program analysis across language boundaries
- Applied AI safety and security — adversarial robustness, LLM jailbreak defense
- Privacy-preserving computation — fully homomorphic encryption, zero-knowledge proofs
- Reproducible, honestly-reported machine learning

---

## Activity

<div align="center">

<img src="https://github-readme-stats-fast.vercel.app/api?username=Rexy-5097&show_icons=true&theme=github_dark_dimmed&hide_border=true&count_private=true" alt="GitHub Stats" height="165"/>
<img src="https://github-readme-stats-fast.vercel.app/api/top-langs/?username=Rexy-5097&layout=compact&theme=github_dark_dimmed&hide_border=true&langs_count=8&hide=makefile,css,html,dockerfile" alt="Most Used Languages" height="165"/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Rexy-5097/Rexy-5097/output/snake-dark.svg"/>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Rexy-5097/Rexy-5097/output/snake-light.svg"/>
  <img src="https://raw.githubusercontent.com/Rexy-5097/Rexy-5097/output/snake-dark.svg" alt="Contribution Graph" width="95%"/>
</picture>

</div>

---

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-1f2328?style=flat-square&logo=vercel&logoColor=white)](https://proof-of-work-roan.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/soumyadeb-tripathy/)
[![Email](https://img.shields.io/badge/Email-1f2328?style=flat-square&logo=gmail&logoColor=white)](mailto:soumyadeb043@gmail.com)

</div>
