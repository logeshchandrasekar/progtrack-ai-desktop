# ProgTrack AI - your ultimate progress tracker in service !!

A gamified, fully offline developer-learning dashboard for Windows, built with Electron.

Track topics and goals, log focused coding sessions, and watch your progress turn into XP, levels, streaks, and unlockable achievements — all stored privately on your own machine.

📄 **Full technical documentation:** [DOCUMENTATION.md](https://github.com/logeshchandrasekar/progtrack-ai-desktop/blob/main/DOCUMENTATION.md)

---

## Features

- Topic & goal tracking with auto-synced progress
- Focus timer with a GitHub-style activity heatmap
- XP/leveling system with 27 unlockable achievements
- Daily notes journal
- Live GitHub profile & repo lookup
- Rule-based insights engine that flags stuck topics, streaks, and upcoming deadlines
- Purple pixel-game aesthetic, fully offline, encrypted local storage

---

## Screenshots

### Dashboard — Dark Theme
![Dashboard dark theme](assets/1%20Homepage%20%28dark%29.png)
The main command center in dark mode — displays four live stat cards (topics, today's coding time, goals, completed topics), a weekly coding bar chart, topic progress overview, toggleable activity heatmap, and AI-generated learning insights, all in the purple pixel-game aesthetic.

---

### Dashboard — Light Theme
![Dashboard light theme](assets/2%20Homepage%20%28light%29.png)
The same dashboard switched to light mode via the theme toggle in the sidebar — all charts, heatmaps, and insight cards adapt instantly with no data reload required.

---

### Topics
![Topics page](assets/3%20Topics%20page.png)
The Topics section lists every subject the user is studying — each card shows the topic name, category tag, status badge (In Progress / Completed / Paused), and a progress bar driven entirely by linked goal sub-topic completion, not manual entry.

---

### Goals
![Goals page](assets/4%20Goals%20page.png)
The Goals section is the engine behind topic progress — each goal card shows the linked topic, total sub-topics, completion count, and deadline, with `+` and `−` buttons that increment or decrement sub-topic progress and instantly sync the linked topic's progress bar in real time.

---

### Code Timer
![Timer page](assets/5%20Timer%20page.png)
The Code Timer tracks focused coding sessions with a stopwatch, topic selector, and today's session log — every saved session feeds the activity heatmap, streak counter, and weekly chart on the dashboard.

---

### Notes
![Notes page](assets/6%20Notes%20page.png)
The Notes section is a lightweight daily journal — users write entries up to 2000 characters, save them with a timestamp, and access the full history of past entries through the Notes History panel without cluttering the main view.

---

### GitHub — Profile Search
![GitHub profile page](assets/7%20Github%20profile%20page.png)
The GitHub integration page lets users enter any GitHub username to fetch their public profile — the last searched username is remembered and pre-filled on every visit.

---

### GitHub — Profile Fetched
![GitHub profile fetched](assets/8%20github%20profile%20fetched%20page.png)
After fetching, the GitHub section displays the user's avatar, name, bio, repository count, followers, and following alongside a grid of their six most recently updated repositories — clicking any repository card opens it directly in the system browser.

---

### Rewards & Achievements
![Rewards page](assets/9%20Rewards%20page.png)
The Rewards page shows the user's current level, total XP, progress bar to the next level, and a full achievement grid of 28 badges — unlocked badges glow in gold while locked ones display the exact requirement and XP reward needed to earn them.

---

## Getting Started

```
npm install
npm start
```

Demo login: `demo` / `demo123`

## Build a portable .exe

```
npm run build
```

Output: `dist/ProgTrackAI-Portable.exe`

## Status

In development — being prepared for a future desktop app store release.

## Tech Stack

Electron · JavaScript · electron-store · electron-builder · Chart.js
