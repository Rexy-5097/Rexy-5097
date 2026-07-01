<div align="center">

# Soumyadeb Tripathy

*Computer Science Student — Backend Systems, Distributed Computing, Applied AI*

</div>

<br/>

I build backend systems and applied AI projects, with a focus on distributed computing and software that stays correct under concurrency and failure. My work spans backend services dealing with atomic consistency, async processing, and access control, alongside independent projects in privacy-preserving computation, LLM security, and scientific machine learning. I'd rather report a negative result honestly than round a number up. Currently completing a B.Tech in Computer Science and Engineering at Lovely Professional University, working toward backend and AI systems engineering roles.

<div align="center">

[Current Focus](#current-focus) · [Tech Stack](#tech-stack) · [Selected Projects](#selected-projects) · [Research Interests](#research-interests) · [Connect](#connect)

</div>

---

## Current Focus

|  |  |  |
|---|---|---|
| Backend Engineering | Distributed Systems | Applied Machine Learning |
| System Design | Privacy-Preserving Computation | LLM Security |

---

## Tech Stack

**Languages**

<img src="https://skillicons.dev/icons?i=py,ts,js,c,cpp,solidity&theme=dark" alt="Languages" height="48"/>

**Backend**

<img src="https://skillicons.dev/icons?i=fastapi,express,nodejs,nextjs&theme=dark" alt="Backend" height="48"/>

![REST APIs](https://img.shields.io/badge/REST%20APIs-1f2328?style=flat-square)
![Row-Level Security](https://img.shields.io/badge/Row--Level%20Security-1f2328?style=flat-square)

**Databases**

<img src="https://skillicons.dev/icons?i=postgres,mongodb,redis&theme=dark" alt="Databases" height="48"/>

![TimescaleDB](https://img.shields.io/badge/TimescaleDB-1f2328?style=flat-square)

**Infrastructure**

<img src="https://skillicons.dev/icons?i=docker,git,github,githubactions,linux&theme=dark" alt="Infrastructure" height="48"/>

**AI & Machine Learning**

<img src="https://skillicons.dev/icons?i=pytorch,sklearn&theme=dark" alt="AI & Machine Learning" height="48"/>

![Transformers](https://img.shields.io/badge/Transformers-1f2328?style=flat-square)
![LLM Engineering](https://img.shields.io/badge/LLM%20Engineering-1f2328?style=flat-square)
![Fully Homomorphic Encryption](https://img.shields.io/badge/Fully%20Homomorphic%20Encryption-1f2328?style=flat-square)
![Zero-Knowledge Proofs](https://img.shields.io/badge/Zero--Knowledge%20Proofs-1f2328?style=flat-square)

---

## Selected Projects

**[FurnitureOps](https://github.com/Rexy-5097/FurnitureOps)**
Inventory management backend built around one hard constraint: stock counts must stay correct under concurrent purchases and retried requests.

`Next.js` `TypeScript` `Supabase/Postgres` `Redis`

- Purchases are enqueued (not written synchronously) onto a Redis-backed queue; a separate worker applies stock changes through a row-locking Postgres RPC, with retries, a circuit breaker, and a dead-letter queue.
- Row Level Security policies separate authenticated-read from admin-write at the database layer, not just in application code.

<br/>

**[GEOFENCE-LLM](https://github.com/Rexy-5097/GEOFENCE-LLM)**
A jailbreak-detection layer for LLMs that inspects the model's internal hidden-state trajectory during generation, instead of classifying prompt text.

`Python` `PyTorch` `Transformers`

- Fail-closed control loop (signal extraction → state estimation → risk scoring → authority decision) modeled after a control-systems hypervisor, decoupled from any specific base model.
- Measured obfuscated-prompt recall of 0.66 at a 0.48 false-positive rate — published in the repo's own audit alongside the honest limitation that this makes it unsuitable as a standalone filter.

<br/>

**[Raptor-AI](https://github.com/Rexy-5097/Raptor-AI)**
A local-first, voice-activated AI agent for macOS: wake-word detection, local speech-to-text, tool-calling, and proactive system/network monitoring.

`Python` `FastAPI` `Groq` `Faster-Whisper`

- Six-layer architecture (perception → orchestration → execution → daemons → learning → presentation) with an explicit agent finite-state machine and a priority engine that adapts alert frequency from user feedback.
- Runs local speech-to-text and TTS; only LLM reasoning calls out to an external API.

<br/>

**[Helios-Dx](https://github.com/Rexy-5097/Helios-Dx)**
A controlled research evaluation of Variational Quantum Circuits vs. classical layers for privacy-preserving medical image classification.

`PyTorch` `PennyLane` `Concrete-ML (FHE)`

- Capacity-matched ablation (frozen backbone, same optimizer/seed) found no statistically significant quantum advantage — reported as a null result rather than reframed as a positive one.
- Extreme feature-dimensionality reduction (768 → 4) to make the classification head FHE-compatible, with measured plaintext vs. encrypted-inference latency.

<br/>

**[zkhealth-fhe](https://github.com/Rexy-5097/zkhealth-fhe)**
A privacy-preserving electronic health record platform on an FHE-capable EVM chain, where patients hold their own decryption keys.

`Solidity` `fhEVM` `Node.js` `Arweave`

- Client-side AES-256-GCM encryption before any data leaves the device; on-chain registry stores only hashes and access grants, never plaintext or keys.
- Doctor access requires an explicit on-chain authorization signature from the patient, verified before proxy re-encryption.

<br/>

**[ASTRA](https://github.com/Rexy-5097/ASTRA)**
An end-to-end ML pipeline classifying variable stars from TESS light curves into five astrophysical categories.

`Python` `PyTorch` `Next.js`

- Dataset and checkpoints are SHA-256 fingerprinted and hash-locked; reported metrics (78.17% test accuracy, macro F1 0.7677) are independently recomputed from checkpoint weights in the repo's own ground-truth audit, not just logged during training.
- Explicitly flags its weakest class (Solar-like, F1 0.52, under-represented in the dataset) as not production-ready rather than omitting it.

---

## Research Interests

- Distributed systems and correctness under concurrent or partial failure
- Applied AI safety and security — adversarial robustness, LLM jailbreak defense
- Privacy-preserving computation — fully homomorphic encryption, zero-knowledge proofs
- Reproducible, honestly-reported machine learning

---

## GitHub Statistics

<div align="center">

<img src="https://github-readme-stats-fast.vercel.app/api?username=Rexy-5097&show_icons=true&theme=github_dark_dimmed&hide_border=true&count_private=true" alt="GitHub Stats" height="165"/>

<img src="https://github-readme-activity-graph.vercel.app/graph?username=Rexy-5097&theme=github-compact&hide_border=true" alt="Contribution Graph" width="95%"/>

</div>

---

## Connect

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/soumyadeb-tripathy/)
[![Email](https://img.shields.io/badge/Email-1f2328?style=flat-square&logo=gmail&logoColor=white)](mailto:soumyadeb043@gmail.com)

</div>
