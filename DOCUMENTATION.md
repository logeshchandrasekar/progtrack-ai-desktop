# ProgTrack AI — Complete Project Documentation

**Version:** 2.0.0  
**Platform:** Windows (Desktop)  
**Type:** Offline-first Electron Desktop Application  
**Author:** Logesh Chandrasekar  
**Last Updated:** July 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [What It Does](#3-what-it-does)
4. [Tech Stack](#4-tech-stack)
5. [System Architecture](#5-system-architecture)
6. [File Structure](#6-file-structure)
7. [Data Model](#7-data-model)
8. [Core Features — Deep Dive](#8-core-features--deep-dive)
9. [How It Works — System Flows](#9-how-it-works--system-flows)
10. [Security & Privacy](#10-security--privacy)
11. [Installation & Build Guide](#11-installation--build-guide)
12. [User Guide](#12-user-guide)
13. [Pros & Strengths](#13-pros--strengths)
14. [Known Limitations](#14-known-limitations)
15. [Future Roadmap](#15-future-roadmap)
16. [Version History](#16-version-history)

---

## 1. Project Overview

ProgTrack AI is a personal developer learning dashboard built as a **portable Windows desktop application**. It gives software developers a single, structured place to track everything related to their self-directed learning — the topics they are studying, the goals they are chasing, the time they spend coding, the notes they write, and the progress they make — all stored privately on their own machine with no cloud, no subscription, and no data leaving the device.

The application is wrapped in a **retro pixel-game aesthetic** — intentionally designed to feel like a game rather than a productivity tool — because learning is more sustainable when it feels rewarding. Every session logged, topic completed, or goal achieved earns the user XP and unlocks achievements, creating a progression loop that keeps momentum going.

ProgTrack AI is not a project manager, a task tracker, or a team collaboration tool. It is a personal, private, solo developer learning companion.

---

## 2. Problem Statement

Self-taught developers and continuous learners face a specific and underserved problem: **they have no structured way to track their learning journey across many topics over time**.

The existing alternatives all fall short in different ways:

| Tool | Problem |
|---|---|
| Notion / Obsidian | Too general-purpose; requires significant setup; no session timer or gamification |
| GitHub contribution graph | Only shows commit activity; tells nothing about what you studied |
| Course platforms (Udemy, Coursera) | Only tracks courses on that platform; misses self-study and side projects |
| Spreadsheets | No visual feedback; tedious to maintain; no session timing |
| Habit trackers | Binary yes/no; can't express depth of learning or topic-level progress |

The result is that most developers either track nothing at all or rely on memory to understand where they stand. This causes:

- **Loss of momentum** — no visual record of progress makes effort feel invisible
- **Scattered focus** — studying whatever feels interesting without a structured goal
- **No accountability** — nothing to reflect on when deciding what to study next
- **Demotivation** — long learning arcs (weeks or months per topic) feel endless without milestones

ProgTrack AI solves this by combining a **topic tracker, a goal system, a code timer, a daily journal, GitHub integration, and a reward engine** into one coherent desktop tool that works completely offline.

---

## 3. What It Does

At its core, ProgTrack AI does six things:

**1. Tracks learning topics with sub-topic-driven progress**  
A user adds any topic they are studying (e.g., "React", "DSA Basics", "System Design"). Progress on that topic is not entered manually — it is calculated automatically from the linked goal's sub-topic completion ratio. This ensures progress is always meaningful and grounded in real milestones, not arbitrary percentages.

**2. Manages goals with deadline tracking**  
Each goal has a title, a linked topic, a total number of sub-topics, how many are completed, and a deadline in days. The user presses `+` or `−` inside the goal card to mark sub-topics complete or incomplete. Every press instantly recalculates the linked topic's progress bar. When a goal is marked complete, the topic reaches 100% and the goal moves to history.

**3. Times every coding session**  
A built-in stopwatch lets users log exactly how much time they spend coding on each topic. Sessions accumulate into a daily activity log that feeds the heatmap and the weekly bar chart. A complete history of every session ever logged is accessible through the Coding History panel.

**4. Maintains a daily learning journal**  
The Notes section provides a lightweight daily journal. Each entry is timestamped with a date and time. The full history of notes is accessible through the Notes History panel, giving users a personal log of their learning journey over time.

**5. Connects to GitHub**  
Users can enter any GitHub username to pull their public profile — repositories, bio, follower count, and recent activity — directly inside the app. This gives context about what projects are associated with what they are learning.

**6. Gamifies the entire experience**  
Every meaningful action earns XP. XP accumulates into levels (Rookie → Apprentice → Developer → ... → Legendary). Specific milestones unlock 28 achievements (badges). A reward popup appears on level-ups and badge unlocks. The Rewards page shows the full achievement grid with locked and unlocked states, XP values, and unlock requirements.

---

## 4. Tech Stack

### Runtime & Framework

| Technology | Version | Role |
|---|---|---|
| **Electron** | 28.3.3 | Desktop app wrapper — provides the chromium renderer and Node.js main process |
| **Node.js** | LTS (18+) | JavaScript runtime for the main process |
| **Chromium** | Bundled with Electron 28 | Renders the HTML/CSS/JS frontend |

### Frontend

| Technology | Role |
|---|---|
| **HTML5** | Single-file renderer (`renderer/index.html`) — all markup |
| **CSS3** | All styling — pixel game theme, animations, layout — written inline in the HTML file |
| **Vanilla JavaScript (ES2022)** | All application logic — no frontend framework |
| **Chart.js 4.4.0** | Bar charts (weekly coding, topic progress) and line chart (daily timer log), loaded via CDN |
| **Press Start 2P** (Google Fonts) | Pixel game display font for headings, nav labels, and titles |
| **VT323** (Google Fonts) | Secondary retro terminal font for body text |
| **Share Tech Mono** (Google Fonts) | Monospaced font for metadata and chart labels |

### Data & Storage

| Technology | Role |
|---|---|
| **electron-store 8.2.0** | Encrypted local JSON storage — persists all user data in `%APPDATA%\progtrack-ai\progtrack-data.json` |
| **AES-256 encryption** | electron-store encrypts the JSON file at rest using the key `pt-secure-2024` |

### Build & Distribution

| Technology | Role |
|---|---|
| **electron-builder 24.13.3** | Packages the app into a portable Windows `.exe` |
| **build.bat** | One-click Windows build script — runs `npm install` and `npm run build` |

### Security

| Technology | Role |
|---|---|
| **contextIsolation: true** | Electron security setting — renderer cannot access Node.js directly |
| **nodeIntegration: false** | Renderer has no access to Node APIs |
| **contextBridge (preload.js)** | The only bridge between renderer and main process — exposes a minimal, typed API |
| **Content Security Policy (CSP)** | Meta tag restricts script, style, font, image, media, and connect sources |

### Media

| Technology | Role |
|---|---|
| **MP4 (H.264)** | Intro video played at app launch via HTML5 `<video>` element |
| **ICO (multi-size)** | App icon embedded in the `.exe` and shown in the Windows taskbar |

---

## 5. System Architecture

ProgTrack AI follows the standard Electron two-process model with a strict security boundary between the processes.

```
┌──────────────────────────────────────────────────────────────────┐
│                        ELECTRON PROCESS                          │
│                                                                  │
│  ┌─────────────────────┐         ┌──────────────────────────┐   │
│  │    MAIN PROCESS     │         │    RENDERER PROCESS      │   │
│  │    (main.js)        │◄───────►│    (index.html)          │   │
│  │                     │   IPC   │                          │   │
│  │  • BrowserWindow    │         │  • HTML/CSS/JS UI        │   │
│  │  • electron-store   │         │  • Chart.js charts       │   │
│  │  • ipcMain handlers │         │  • All app logic         │   │
│  │  • App menu         │         │  • Google Fonts          │   │
│  │  • File system      │         │  • Video player          │   │
│  │  • Single instance  │         │                          │   │
│  └──────────┬──────────┘         └──────────┬───────────────┘   │
│             │                               │                    │
│             │         ┌─────────────────┐   │                    │
│             └────────►│  PRELOAD.JS     │◄──┘                    │
│                       │  (context bridge│                        │
│                       │                 │                        │
│                       │  • store get    │                        │
│                       │  • store set    │                        │
│                       │  • store del    │                        │
│                       │  • video-path   │                        │
│                       │  • open-url     │                        │
│                       └─────────────────┘                        │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│   FILESYSTEM (AppData)       │
│                              │
│  %APPDATA%\progtrack-ai\     │
│    progtrack-data.json       │
│    (AES-256 encrypted)       │
└──────────────────────────────┘
```

### Process Responsibilities

**Main Process (`main.js`)**  
Runs in Node.js. Responsible for creating the application window, registering all IPC handlers, managing the electron-store instance, building the native app menu, handling single-instance locking, and resolving file system paths correctly for both development and packaged builds.

**Renderer Process (`renderer/index.html`)**  
Runs in Chromium. Responsible for the entire user interface and all application logic. Has no direct access to Node.js or the file system. All storage reads and writes go through the preload bridge.

**Preload Script (`preload.js`)**  
The secure boundary between the two processes. Uses Electron's `contextBridge` to expose a minimal, explicitly-typed API (`window.electronAPI`) to the renderer. Only the exact methods listed in the bridge are accessible — nothing else from Node or Electron leaks through.

### IPC Channel Map

| Channel | Direction | Purpose |
|---|---|---|
| `store-get` | Renderer → Main | Read a value from electron-store |
| `store-set` | Renderer → Main | Write a value to electron-store |
| `store-del` | Renderer → Main | Delete a key from electron-store |
| `store-has` | Renderer → Main | Check if a key exists |
| `store-clear` | Renderer → Main | Clear all stored data |
| `app-version` | Renderer → Main | Get app version string |
| `app-path` | Renderer → Main | Get userData path |
| `video-path` | Renderer → Main | Get absolute file:// URL to intro video |
| `renderer-path` | Renderer → Main | Get renderer folder path (legacy) |
| `open-url` | Renderer → Main | Open a URL in system browser |

---

## 6. File Structure

```
progtrack-desktop/
│
├── main.js                    # Electron main process
├── preload.js                 # Context bridge (security boundary)
├── package.json               # Dependencies, build config, app metadata
├── package-lock.json          # Locked dependency versions
├── build.bat                  # One-click Windows build script
├── README.md                  # Quick-start guide
│
├── build/
│   └── icon.ico               # App icon (multi-size: 16/32/48/256px)
│
├── renderer/
│   ├── index.html             # Complete frontend — all HTML, CSS, JS in one file
│   └── assets/
│       └── PROGTRACK_AI.mp4   # Intro video played at startup
│
├── node_modules/              # Installed dependencies (not committed)
│   ├── electron/
│   ├── electron-store/
│   ├── electron-builder/
│   └── ...
│
└── dist/                      # Build output (generated by build.bat)
    └── ProgTrackAI-Portable.exe
```

### Runtime data location (Windows)

```
C:\Users\<username>\AppData\Roaming\progtrack-ai\
    progtrack-data.json        # All user data, AES-256 encrypted
    progtrack-data.json.bak    # Automatic backup (created by electron-store)
```

---

## 7. Data Model

All data is stored in a single encrypted JSON file via electron-store. Each user's data is namespaced with their username prefix (e.g., `demo_topics`, `demo_goals`) so multiple accounts can share the same file safely.

### Global Keys (not user-scoped)

```json
{
  "users": {
    "demo": {
      "username": "demo",
      "password": "<base64-encoded hash>",
      "at": 1720000000000
    }
  },
  "cu": "demo",
  "ct": 1720000000000,
  "theme": "dark"
}
```

### User-Scoped Keys (`{username}_{key}`)

#### Topics (`{user}_topics`)
```json
[
  {
    "id": "t1720000000001",
    "name": "JavaScript",
    "cat": "Frontend",
    "prog": 62,
    "status": "active",
    "at": 1720000000001
  }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique ID — `"t" + Date.now()` |
| `name` | string | Topic name as entered by user |
| `cat` | string | Category — Frontend / Backend / DSA / DevOps / AI/ML / Other |
| `prog` | number | Progress 0–100, calculated from linked goal's sub-topic ratio |
| `status` | string | `active` / `completed` / `paused` |
| `at` | number | Unix timestamp of creation |

#### Goals (`{user}_goals`)
```json
[
  {
    "id": "g1720000000002",
    "title": "Master JavaScript Fundamentals",
    "tid": "t1720000000001",
    "total": 12,
    "done": 7,
    "days": 30,
    "at": 1720000000002,
    "active": true,
    "completedAt": null
  }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique ID — `"g" + Date.now()` |
| `title` | string | Goal title |
| `tid` | string | ID of the linked topic |
| `total` | number | Total number of sub-topics in this goal |
| `done` | number | How many sub-topics are completed |
| `days` | number | Deadline in days from creation |
| `at` | number | Unix timestamp of creation |
| `active` | boolean | `true` = visible in goals list; `false` = archived in history |
| `completedAt` | number | Timestamp of completion, null if still active |

#### Sessions (`{user}_sessions`)
```json
[
  {
    "id": "s1720000000003",
    "topic": "JavaScript",
    "duration": 3600,
    "date": "2026-07-10",
    "time": "09:30 AM"
  }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique ID — `"s" + Date.now()` |
| `topic` | string | Topic name selected in timer dropdown |
| `duration` | number | Session length in seconds |
| `date` | string | ISO date string `YYYY-MM-DD` |
| `time` | string | Human-readable time of day |

#### Activity (`{user}_activity`)
```json
{
  "2026-07-10": 120,
  "2026-07-11": 45,
  "2026-07-12": 200
}
```

A flat date-keyed map of total minutes coded per day. Feeds the heatmap and streak counter.

#### Notes (`{user}_notes`)
```json
[
  {
    "id": "n1720000000004",
    "text": "Finally understood closures today...",
    "date": "2026-07-10",
    "time": "11:15 PM",
    "at": 1720000000004
  }
]
```

#### Rewards (`{user}_xp`, `{user}_unlocked_badges`)
```json
{
  "xp": 450,
  "unlocked_badges": ["first_login", "first_topic", "streak_3", "scholar"]
}
```

---

## 8. Core Features — Deep Dive

### 8.1 Authentication

ProgTrack AI implements a lightweight local authentication layer. Passwords are encoded with a base64 wrapper before storage — they are never stored in plain text. Sessions persist for 7 days via a `cu` (current user) and `ct` (created time) key pair stored in the JSON file. On launch, the app checks whether a valid session exists; if so, the user is taken directly to the dashboard without re-entering credentials. A demo account (`demo` / `demo123`) is seeded automatically on first launch.

### 8.2 Intro Video

On every app launch, a fullscreen intro video (`PROGTRACK_AI.mp4`) plays before the auth screen appears. App data loads in the background during playback so there is zero additional wait time after the video ends. A SKIP button appears in the bottom-right corner. If the video file is missing or fails to load, the app falls back gracefully and proceeds normally. A 30-second hard timeout ensures the app always starts even in unexpected failure scenarios.

The video file is placed outside the Electron ASAR archive using `extraResources` in the build config, and its absolute file path is constructed in the main process using Node's `pathToFileURL()` to guarantee correct path resolution on all Windows configurations including usernames with spaces or special characters.

### 8.3 Dashboard

The dashboard is the default landing page after login. It shows:

- **Four stat cards** — total topics, today's coding time, active goals, completed topics — each with a proportional progress bar
- **Weekly coding bar chart** — hours per day for the last 7 days, with today highlighted in the primary purple color
- **Topic progress bar chart** — horizontal bars showing the progress percentage of the top 6 topics
- **Activity heatmap** — toggleable between monthly (compact single-row calendar) and yearly (52-week GitHub-style grid) views
- **AI Insights panel** — two locally-generated insight cards that analyse the user's data and surface observations such as inactivity alerts, stuck topics, upcoming deadlines, and streak milestones. Insights are generated in JavaScript from the stored data — no API call is made.

### 8.4 Topics

Topics represent the subjects a developer is actively studying. Each topic has a name, a category, a status (active / completed / paused), and a progress bar that is driven entirely by the linked goal's sub-topic completion ratio.

The user cannot manually set or drag the progress bar. This is intentional — progress must reflect real milestone completion, not an arbitrary self-assessed number. The only way to advance a topic's progress bar is to mark sub-topics complete inside its linked goal.

The edit modal (pencil button on each topic card) allows changing the name and status only. If a goal is removed, the linked topic's progress resets to 0%.

### 8.5 Goals

Goals are the engine that drives topic progress. Each goal has:

- A title
- A linked topic (selected from existing topics)
- A total number of sub-topics
- A count of completed sub-topics
- A deadline in days

Inside each goal card, `+` and `−` buttons increment or decrement the completed sub-topic count by one. Each press recalculates `Math.round((done / total) * 100)` and writes that value directly to the linked topic's `prog` field. This means the topic progress bar updates in real time with every button press.

When `done === total`, the user can press **MARK COMPLETE** to archive the goal. This sets `done = total` (guaranteeing 100%), sets the topic to completed status, moves the goal to the Goals History, and awards 50 XP.

Completed goals are accessible in the Goals History panel, which shows each archived goal's title, linked topic, sub-topic ratio, deadline, start date, and completion date.

### 8.6 Code Timer

The code timer is a stopwatch that tracks active coding sessions. The user selects which topic they are coding on, presses START, and the timer counts up in HH:MM:SS format. Pressing PAUSE freezes the timer; pressing RESET saves the session and resets to zero.

Sessions shorter than 10 seconds are discarded. Each saved session is written to the `sessions` array and its minutes are added to the `activity` date map. This feeds the heatmap, the weekly chart, the streak counter, and achievement checks.

The CODING HISTORY button opens a full-screen panel showing every session ever logged, grouped by date with a daily total, sorted newest first.

### 8.7 Notes

The Notes section is a simple daily journal. The user writes in a textarea (up to 2000 characters) and saves. The entry is stored with a date and timestamp. If a note already exists for today when the page loads, it does not auto-fill — this is intentional to encourage fresh daily entries rather than edits of old ones.

The NOTES HISTORY button opens a panel showing all past entries newest-first, each with its date and time header and a delete button.

### 8.8 GitHub Integration

The user enters any GitHub username and clicks FETCH. The app makes two parallel requests to the public GitHub REST API — one for the user profile and one for their top 6 most recently updated repositories. Results display a profile card (avatar, name, bio, repo count, followers, following) and a grid of repository cards (name, description, star count, fork count, language). Clicking any repository card opens it in the system browser.

The last fetched username is persisted so it pre-fills on the next visit. No authentication token is required or used — only public data is accessed.

### 8.9 Rewards & XP System

The rewards system creates a progression loop that rewards consistency and depth of engagement.

**XP events:**

| Action | XP Earned |
|---|---|
| Saving a coding session | +10 XP |
| Writing a daily note | +5 XP |
| Completing a goal | +50 XP |
| Unlocking a badge | +badge XP (varies) |

**Level progression:**

| Level | Name | XP Required |
|---|---|---|
| 1 | Rookie | 0 |
| 2 | Apprentice | 100 |
| 3 | Developer | 200 |
| 4 | Hacker | 300 |
| 5 | Expert | 400 |
| 6 | Master | 500 |
| 7 | Legend | 600 |
| 8 | Mythic | 700 |
| 9 | Immortal | 800 |
| 10 | Godlike | 900 |

**Achievement categories:**

- **Starter badges** — First login, first topic, first goal, first session, first note
- **Streak badges** — 3, 7, 14, and 30-day consecutive coding streaks
- **Topic badges** — First completion, 3 completions, 5 topics tracked, 10 topics tracked
- **Goal badges** — 3 active goals, 60+ combined goal days
- **Note badges** — 5 notes, 20 notes
- **Time badges** — 2h in a day, 4h in a day, 10 total hours, 50 total hours
- **Level badges** — Level 5, 10, 20, 50
- **Special badges** — Night Owl (coded after 11 PM), Early Bird (coded before 7 AM)

A reward popup (slide-in notification) appears whenever a badge is unlocked or a level-up occurs, showing the badge icon, name, and XP awarded.

---

## 9. How It Works — System Flows

### App Launch Flow

```
.exe launched
     │
     ▼
main.js creates BrowserWindow
     │
     ▼
index.html loads
     │
     ├── Video plays fullscreen (PROGTRACK_AI.mp4 via file:// URL from IPC)
     │
     ├── loadAppData() runs in background:
     │     ├── Load theme from store
     │     ├── seedDemo() if first run
     │     └── Check session validity (cu + ct within 7 days)
     │
     ▼
Video ends (or user clicks SKIP)
     │
     ├── If valid session → bootApp(username)
     └── If no session → show auth screen
```

### Topic Progress Update Flow

```
User presses + on a goal card
     │
     ▼
adjGoalProg(goalId, +1)
     │
     ├── goals[goalId].done += 1 (capped at total)
     ├── S.us('goals', updatedGoals)
     │
     ▼
recalcTopicProg(linkedTopicId, updatedGoals)
     │
     ├── newProg = Math.round((done / total) * 100)
     ├── topics[linkedTopicId].prog = newProg
     ├── if newProg >= 100 → status = 'completed'
     └── S.us('topics', updatedTopics)
     │
     ▼
renderGoals() + renderTopics()
     │
     └── Both sections re-render — topic progress bar updates immediately
```

### Session Save Flow

```
User presses RESET on timer
     │
     ├── if duration > 10s:
     │     ├── Build session object {id, topic, duration, date, time}
     │     ├── Append to sessions array → S.us('sessions', ...)
     │     ├── Add minutes to activity[today] → S.us('activity', ...)
     │     ├── gainXP(10)
     │     ├── tryBadge('first_session')
     │     └── Check streak badges + speed_coder badge
     │
     └── Reset timer display to 00:00:00
```

### Authentication Flow

```
User enters username + password → clicks PRESS START
     │
     ├── Fetch users object from store
     ├── Check if username exists
     ├── Compare encode(password) with stored hash
     │
     ├── Match → S.set('cu', username) + S.set('ct', Date.now())
     │           → bootApp(username)
     │
     └── No match → show error, clear password field
```

---

## 10. Security & Privacy

**All data stays on the device.** ProgTrack AI makes no external network requests except two optional ones: loading Google Fonts (CSS and font files) and fetching public GitHub profile data when the user explicitly enters a username. No telemetry, no analytics, no crash reporting, no usage tracking.

**The data file is encrypted.** electron-store encrypts `progtrack-data.json` with AES-256 using the key defined in `main.js`. The file is not human-readable if opened directly.

**The renderer is sandboxed.** Electron is configured with `contextIsolation: true` and `nodeIntegration: false`. The renderer cannot call any Node.js API, cannot access the file system directly, and cannot escape the Chromium sandbox. The only surface exposed to the renderer is the typed API in `preload.js`.

**Passwords are not stored in plain text.** User passwords are run through a base64 encoding function with a salt prefix and suffix before being written to the JSON file. While this is not cryptographic hashing (bcrypt/argon2), it means passwords are not immediately readable if someone opens the data file in a hex editor. For a fully offline, single-user local app this is an acceptable trade-off.

**Content Security Policy is enforced.** A strict CSP meta tag in `index.html` limits which sources can load scripts, styles, fonts, images, and media. Inline scripts are permitted (necessary for the single-file architecture), but external scripts are restricted to `cdn.jsdelivr.net` for Chart.js only.

---

## 11. Installation & Build Guide

### Prerequisites

- Windows 10 or Windows 11 (64-bit)
- Node.js LTS (v18 or later) — download from [nodejs.org](https://nodejs.org)
- Internet connection (for the initial `npm install` only)

### One-Click Build

```
1. Place your video at:  renderer/assets/PROGTRACK_AI.mp4
2. Place your icon at:   build/icon.ico  (must contain 16/32/48/256px sizes)
3. Double-click:         build.bat
4. Wait 2-3 minutes
5. Your .exe is at:      dist/ProgTrackAI-Portable.exe
```

### Manual Build

```bash
npm install
npm run build
```

### Development (Run Without Building)

```bash
npm install
npm start
```

### Build Output

electron-builder produces a single portable executable at `dist/ProgTrackAI-Portable.exe`. No installation is required — the user double-clicks the file and the app runs. User data is stored in `%APPDATA%\progtrack-ai\` and persists across app updates as long as the `appId` in `package.json` is not changed.

### Resetting All Data

To start fresh, delete the data file at:
```
%APPDATA%\progtrack-ai\progtrack-data.json
```
The app will re-seed the demo account on next launch.

---

## 12. User Guide

### First Launch

1. Run `ProgTrackAI-Portable.exe`
2. Watch the intro video (or click SKIP)
3. Log in with `demo` / `demo123` to explore, or click NEW GAME to register

### Adding Topics

1. Go to **◉ TOPICS** in the sidebar
2. Enter a topic name, select a category, click **+ ADD**
3. Progress starts at 0% and will only move when you link a goal to this topic

### Creating a Goal

1. Go to **◎ GOALS** in the sidebar
2. Fill in the goal title, link a topic, enter total sub-topics, already-completed sub-topics, and deadline days
3. Click **+ ADD GOAL**
4. The linked topic's progress bar updates immediately based on the current completion ratio

### Advancing a Goal

1. Find the goal card in the Goals section
2. Press **+** to mark one sub-topic as complete — the linked topic's bar advances
3. Press **−** to undo — the linked topic's bar decreases
4. When all sub-topics are done, press **✓ MARK COMPLETE** to archive the goal at 100%

### Logging a Session

1. Go to **◷ CODE TIMER** in the sidebar
2. Select the topic from the dropdown
3. Press **▶ START SESSION**
4. Press **⏸ PAUSE** to pause, **↺ RESET** to stop and save

### Writing a Note

1. Go to **◐ NOTES** in the sidebar
2. Write your daily log in the textarea (up to 2000 characters)
3. Press **SAVE NOTE** — it is stored with today's date and time
4. Click **▶ NOTES HISTORY** to view all past entries

### Checking GitHub Activity

1. Go to **◇ GITHUB** in the sidebar
2. Enter your GitHub username and press **FETCH**
3. Your profile and top 6 repositories appear — click any repository to open it in your browser

### Viewing Achievements

1. Click **★ REWARDS** in the sidebar
2. See your current level, XP total, progress to next level, and all badges (unlocked and locked)

---

## 13. Pros & Strengths

**Complete offline operation.** The app works with zero internet connection (except optional GitHub fetch and font loading). There is no account to create, no server to depend on, no subscription to manage.

**Single portable executable.** The entire app is a single `.exe` file. No installer, no registry entries, no admin rights needed. Copy it to a USB drive and run it on any Windows machine.

**Progress is tied to real milestones.** Topic progress is not a slider the user drags based on feeling — it is a calculated ratio from actual sub-topic completion. This makes the progress bar genuinely informative.

**Gamification that feels earned.** The XP system, level progression, and badge unlocks are triggered by genuine user actions (coding, completing goals, maintaining streaks), not by clicking buttons or self-reporting. This makes the rewards feel meaningful.

**Single-file frontend architecture.** The entire renderer — HTML, CSS, and JavaScript — lives in one file. This makes the project extremely easy to inspect, modify, and share. There are no build steps for the frontend, no transpilation, no module bundler.

**Encrypted local storage.** User data never leaves the device and is stored in an AES-256 encrypted file, giving a meaningful level of protection against casual snooping.

**Robust data persistence.** Separating application code (the `.exe`) from user data (`%APPDATA%`) means rebuilding or updating the app never risks data loss. The data file survives app uninstall, reinstall, and version upgrades.

**Dual heatmap views.** The activity heatmap can be toggled between a compact monthly view (single-row calendar with the current month) and a full GitHub-style 52-week yearly view starting from January 1 of the current year, giving both precision and a long-horizon view of coding consistency.

**Session history preserved indefinitely.** Every coding session ever logged is stored and accessible through the Coding History panel. There is no expiry or archiving — the full record is always available.

---

## 14. Known Limitations

**Single-platform.** The app is built and tested for Windows only. While Electron supports macOS and Linux, the build configuration, icon format (`.ico`), and file path handling have not been adapted for other operating systems.

**Password security is basic.** User passwords are base64-encoded rather than cryptographically hashed with bcrypt or argon2. For a local single-user app this is acceptable, but it would not be appropriate if the data file were ever synced to a shared location.

**No cloud sync.** Data is on one machine. If the user switches computers, they must manually copy the `%APPDATA%\progtrack-ai\` folder. There is no sync, export, or backup mechanism built into the app.

**One goal per topic.** The current architecture links one goal to one topic. A topic cannot have multiple parallel goals. This means a topic with several concurrent learning tracks cannot be accurately represented.

**Chart.js loaded from CDN.** The weekly and topic charts require an internet connection to load on first launch (Chart.js is fetched from `cdn.jsdelivr.net`). If the CDN is unavailable and the library is not cached, charts will not render.

**No data export.** There is no way to export notes, sessions, or goals to a file (CSV, PDF, etc.) from inside the app. The only accessible format is the raw encrypted JSON, which requires electron-store to decrypt.

**No search or filtering.** Notes, sessions, and goals cannot be searched or filtered by keyword, topic, or date range. The full history panels show all records in reverse chronological order only.

**AI Insights are rule-based.** The insights shown on the dashboard are generated by a set of if/else rules examining the user's data (inactivity thresholds, progress rates, streak length). They are labelled "AI Insights" but do not use any machine learning model or language model.

**GitHub integration is read-only and unauthenticated.** Only public profile data and public repositories are accessible. Private repositories, contribution graphs, and commit history cannot be shown without OAuth authentication.

**Video codec dependency.** The intro video must be encoded in H.264 (the most common MP4 codec). Videos encoded in H.265/HEVC will not play in Electron's bundled Chromium without additional codec support.

---

## 15. Future Roadmap

The following features are planned or proposed for future development. They are ordered roughly by priority and complexity.

### Near-term (v2.1 – v2.2)

**Data export and import**  
Allow users to export their full data (sessions, notes, topics, goals, achievements) as a JSON or CSV file, and import data from a backup. This would solve the multi-machine use case and allow users to back up their records.

**Multiple goals per topic**  
Refactor the goal-topic relationship to support multiple active goals linked to the same topic. The topic's progress bar would aggregate across all linked goals (e.g., average or highest completion).

**In-app data reset button**  
A Settings or Profile section with a "Clear All Data" option that calls `store.clear()` and restarts the app without requiring the user to navigate to `%APPDATA%`.

**Offline Chart.js**  
Bundle Chart.js locally inside the `renderer/assets/` folder so charts render with zero internet connection.

**Session tagging**  
Allow users to add a short description or tags to a coding session (e.g., "debugging", "new concept", "revision") for richer history browsing.

### Medium-term (v2.3 – v2.5)

**Real AI insights via Anthropic API**  
Integrate the Anthropic Claude API (claude-sonnet-4-6) to generate genuinely personalised insights based on the user's learning data. The user would enter their own API key in Settings. Responses would be cached to minimise API usage.

**macOS and Linux support**  
Add `.dmg` (macOS) and `.AppImage` (Linux) build targets to `package.json`. Adapt file paths, icon formats, and keyboard shortcuts for each platform.

**Pomodoro mode**  
Add an optional Pomodoro overlay to the timer — configurable work and break intervals with audio notifications.

**Goal templates**  
Pre-built goal structures for common learning paths (e.g., "Learn React", "Prepare for DSA Interviews", "Get AWS Certified") with pre-filled sub-topics the user can customise.

**Topic roadmap view**  
A visual dependency graph where topics can be linked as prerequisites of other topics, giving a bird's-eye view of a structured learning curriculum.

### Long-term (v3.0+)

**Optional encrypted cloud sync**  
End-to-end encrypted sync of the data file to a user-chosen storage provider (Dropbox, Google Drive, S3) so the same data is accessible across multiple machines.

**Plugin / extension system**  
An API that allows third-party scripts to add custom pages, badge types, or data visualisations to the app without modifying core files.

**Mobile companion app**  
A read-only or limited-write mobile app (React Native or Flutter) that can sync with the desktop app's data to let users review their progress and log quick notes from their phone.

**Voice note integration**  
A microphone button in the Notes section that records and transcribes a short voice note using the Web Speech API, appending the transcript to the text area.

**Calendar integration**  
A weekly planner view that allows users to schedule study blocks for specific topics and mark them as completed, integrating deadline data from active goals.

---

## 16. Version History

### v2.0.0 — July 2026

Complete visual and functional redesign from v1.

- **Theme** — Replaced the dark green hacker theme with a purple pixel game aesthetic. Press Start 2P font throughout. Pixel-style borders, box shadows, and scanline overlay. Retro game colour palette.
- **Navigation** — Sidebar moved to always-visible right side. Nav items use pixel symbols instead of emojis. Font size increased for readability.
- **Intro Video** — Fullscreen MP4 video plays at launch before auth screen. Background data loading, skip button, error fallback, and 30-second hard timeout.
- **Heatmap** — Monthly view changed to a compact horizontal single-row calendar. Yearly view changed to a proper 2026-anchored 52-week GitHub-style grid with month labels. Toggle between both views. Brighter activity shading.
- **Goals redesign** — Goals now have sub-topic counts (total and completed). The `+` and `−` buttons inside each goal card drive the linked topic's progress bar. Goals can be marked complete and archived to Goals History. Goals History panel mirrors the Coding History panel design.
- **Topics redesign** — `%` input field removed. `+`/`−` adjustment buttons removed. Progress is now read-only and goal-driven. Edit modal reduced to name and status only.
- **Notes** — New dedicated page. Notes history moved behind a "NOTES HISTORY" button that opens a full-screen panel identical to Coding History.
- **AI Insights** — Moved from a standalone page to the bottom of the Dashboard. The AI Insights nav item removed.
- **Rewards** — 28 achievements across 7 categories. XP amounts and unlock requirements displayed on each badge card. Pulsing glow animation on unlocked badges.
- **Goals input bug** — Fixed the Electron-specific keyboard freeze that occurred after deleting a goal using `requestAnimationFrame` focus restoration.
- **Goals dropdown duplication** — Fixed the duplicate topic options caused by `populateGoalTopics()` being called from both `nav()` and `renderGoals()`.
- **App icon** — Added to taskbar and window title bar via `extraResources` build config.
- **Video file path** — Fixed ASAR virtual filesystem issue by using `extraResources` and `pathToFileURL()` in the main process.

### v1.0.0 — 2025

Initial release. Dark green hacker theme. Permanent left sidebar. Manual progress entry. Basic topic, timer, goals, and GitHub sections. No notes, no rewards, no heatmap toggle, no video intro.

---

*This documentation was written for ProgTrack AI v2.0.0. For questions, feature requests, or bug reports, refer to the project repository or contact the author directly.*
