# ProgTrack AI — Technical Documentation

**Version:** 2.0.0 · **Platform:** Windows Desktop (Electron) · **Status:** In development

## 1. Overview

ProgTrack AI is an offline, gamified learning-progress dashboard built for developers who are self-teaching or following a structured curriculum. It solves a specific problem: **most self-learners lose momentum not because they stop learning, but because progress feels invisible.** Without a manager, a cohort, or a course platform tracking you, a week of solid work and a week of doing nothing can feel identical in hindsight.

ProgTrack AI addresses that by turning learning activity into visible, persistent signals — progress bars, streaks, XP, levels, and unlockable achievements — all stored locally and privately on the user's own machine, with no account, server, or internet connection required (aside from one optional GitHub lookup feature).

## 2. Problem It Solves

| Problem | How ProgTrack AI addresses it |
|---|---|
| Scattered tracking (notes app + spreadsheet + memory) | Single dashboard: topics, goals, sessions, and notes in one place |
| No feedback loop for consistency | Daily activity heatmap + streak counters make consistency visible |
| Vague goals ("get better at JS") | Goals are bound to a specific topic and auto-drive that topic's progress % |
| Motivation drop-off over time | XP/leveling and 27 achievement badges provide small, frequent rewards |
| "Am I stuck?" going unnoticed | A rules engine flags topics with low progress after several days |
| Privacy concerns with cloud trackers | All data stored locally via encrypted `electron-store`; nothing leaves the machine except the optional GitHub API call |

## 3. Feature Breakdown

### 3.1 Authentication
Local, multi-profile login (no server). Usernames/passwords are stored per-machine via `electron-store`. Passwords are obfuscated with base64 encoding before storage — **this is not cryptographic hashing**, and should be described accurately (e.g., "locally stored, non-networked credentials") rather than as "encrypted authentication." For a fully offline single-user desktop tool this is a reasonable trade-off, but it is not designed to resist someone with direct access to the data file.

### 3.2 Topics
Users create topics (e.g., "JavaScript", "DSA Basics") with a category, manual or goal-driven progress percentage, and status (`active`/`completed`).

### 3.3 Goals
Goals are bound to a topic and a sub-task count (`done` / `total`). Each `+`/`-` adjustment on a goal recalculates the linked topic's progress bar automatically (`recalcTopicProg()`), so the topic view always reflects real goal progress rather than a manually-guessed percentage.

### 3.4 Focus Timer & Session Log
A start/stop timer logs elapsed coding time per topic per day. Sessions feed directly into the activity heatmap and the XP/streak system.

### 3.5 Activity Heatmap
A GitHub-contribution-style heatmap (month and year views) built from daily activity-minute totals, rendered with vanilla JS + CSS grid (no external charting library for this view).

### 3.6 XP & Leveling
Actions across the app (adding a topic, completing a goal, hitting a streak) award XP via `gainXP()`. Level = `floor(xp / 100) + 1`, with ten named tiers from ROOKIE to GODLIKE.

### 3.7 Achievements (27 badges)
Categorized into Starter, Streak, Topics, Goals, Notes, Coding Time, Levels, and Special (Night Owl / Early Bird / Perfectionist). Checked on every state change via `checkAchievements()`, with a reward popup on unlock.

### 3.8 Notes / Journal
Daily free-text notes with character count and a searchable history panel.

### 3.9 GitHub Profile Lookup
Calls the public GitHub REST API (`api.github.com/users/{username}` and `.../repos`) to display a user's avatar, bio, repo/follower counts, and recent repositories. This is a read-only, unauthenticated public API call — no GitHub login or token is involved.

### 3.10 "AI Insights"
A deterministic rules engine, **not a machine-learning model**. `getInsights()` checks conditions like:
- No activity logged in 2+ days → inactivity nudge
- A topic stuck below 30% progress for 5+ days → "stuck" warning
- A topic above 70% progress → encouragement to finish
- A goal due within 3 days → deadline warning
- A 3+ day streak → positive reinforcement

This is an accurate and defensible feature on its own terms (it's a genuinely useful heuristic engine), but should not be described as "AI-powered" in a way that implies a trained model — that distinction matters if it comes up in a technical interview.

## 4. Architecture

```
main.js         Electron main process — window lifecycle, IPC handlers,
                packaged-vs-dev path resolution, single-instance lock
preload.js      contextBridge — exposes a minimal, whitelisted
                `electronAPI` to the renderer (contextIsolation: true,
                nodeIntegration: false)
renderer/       Single-page vanilla JS app (~1,850 lines), Chart.js
  index.html    for line/bar charts, hand-rolled CSS grid for the heatmap
```

**Security-relevant design choices worth calling out (these are genuine strengths):**
- `contextIsolation: true` + `nodeIntegration: false` — the renderer cannot touch Node.js or Electron internals directly; it only gets the specific functions exposed via `preload.js`.
- A strict Content-Security-Policy meta tag in `renderer/index.html` restricts script/style sources to self + two trusted CDNs, and restricts `connect-src` to `https://api.github.com` only — the renderer literally cannot make network requests anywhere else.
- External links are opened via `shell.openExternal()` in the main process rather than inside the app window.

**Data persistence:** `electron-store` (an encrypted JSON file on disk) with per-user-namespaced keys (e.g. `alice_topics`, `alice_goals`), so multiple local profiles on the same machine don't collide.

**Packaging:** `electron-builder`, targeting a portable Windows `.exe` (no installer required). A known packaging challenge — video assets and the app icon needing `extraResources` + an IPC path handler to resolve correctly inside the ASAR-packed build — was already solved in `main.js`'s `resolvePath()` / `video-path` IPC handler.

## 5. Known Limitations (documented honestly, not hidden)

- **Single-machine only** — no cloud sync or backup; uninstalling or wiping the machine loses all data.
- **Password storage** is base64 obfuscation, not a cryptographic hash — acceptable for this offline, single-user context, not suitable if this ever becomes networked/multi-device.
- **"AI Insights" is rule-based**, not ML-based — accurately describe it as a heuristic/rules engine.
- **Hardcoded encryption key** (`pt-secure-2024` in `main.js`) — this should be generated per-install or derived from OS-level secure storage before any public/commercial release, since a hardcoded key in source becomes visible to anyone who can read the code.

## 6. Running Locally

```bash
npm install
npm start          # run in dev mode
npm run build       # produce dist/ProgTrackAI-Portable.exe
```

Demo login: `demo` / `demo123` (seeded automatically on first run).
