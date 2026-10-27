# ⚪ ZeroGen — Zero Config Generation

> **Zero config — From zero to production in one action** • 

**ZeroGen** adalah GitHub Action full-stack composite yang men-generate 11 DevOps skill REAL (bukan mock) dalam 1 action.

## 🧠 11 REAL Skills — Fungsi Jelas

| # | Skill | Fungsi |
|---|-------|--------|
| 1 | **📦 Stack Detector** | Deteksi Node, Next.js, React, Express, Docker, TS, PM (npm/yarn/pnpm). Output primary stack + confidence. |
| 2 | **🔐 Security Surgeon** | Scan 14 files pure JS walker cari hardcoded secrets: AWS Key, GitHub Token, OpenAI Key. Fail CI kalo critical. |
| 3 | **⚡ Perf Guard** | Cek bundle size, dep count, budget 500KB. Warn >60 deps, fail >100. |
| 4 | **🧹 Deadcode Hunter** | Cari TODO, FIXME, console.log berlebihan. Code hygiene. |
| 5 | **📝 Changelog** | Baca git log, detect conventional commit, suggest version bump. |
| 6 | **🚀 Release Guard** | Cek branch main/master, version file, isReleaseReady. |
| 7 | **📜 Supply Chain + SBOM** | Generate CycloneDX 1.5 SBOM VALID dengan serialNumber, bomRef, purl. Cek license, cost optimizer. |
| 8 | **🤖 AI Code Reviewer** | 6 rules: N+1 query, SQLi, hardcoded secret, missing try/catch, god function, console leak. Scan 13 files, post PR review. |
| 9 | **🎭 E2E Playwright** | 3 spec files: fullstack health, deploy preview SBOM valid, security .env check. deployReady. |
| 10 | **🏷️ Auto Labeler** | Auto create label via API, label PR by stack. |
| 11 | **📊 Dashboard Reporter** | Generate Markdown comment di PR + Summary dengan 11 skill + E2E. |

## 🧪 Test REAL - 7/7 PASSED

```
node tests/run-all.js

✅ Stack REAL - node
✅ Security REAL - 14 files
✅ Perf REAL - passed
✅ Deadcode REAL - 13 files
✅ Supply Chain REAL - valid=true bom=3
✅ AI Reviewer REAL - 6 issues
✅ E2E REAL - passed deployReady=true
```

## 🚀 Quick Start

```yaml
uses: Ooblek-Dev/ZeroGen@v5
with:
  features: 'all'
  github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 💻 Fullstack

```
demo-fullstack/
├── backend/server.js (Express 5 - /api/health, /stack, /sbom, /cost)
├── frontend/src/App.jsx (React 19 + Vite 6 - Modern dashboard)
└── Dockerfile (Node 22)

Dashboard: https://ooblek-dev.github.io/ZeroGen/
```

## 📦 GitHub Ready Push

```bash
chmod +x deploy.sh
./deploy.sh Ooblek-Dev/ZeroGen
```

MIT - ZeroGen 2026
