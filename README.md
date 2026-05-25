# 🌌 AetherPlanner: Zero-G Task Manager & Cosmic RPG

Welcome, Space Explorer! **AetherPlanner** is a gamified RPG task manager designed with a premium, zero-gravity cosmic fantasy aesthetic. Turn your daily duties and development tasks into cosmic quests, earn XP and Gold, level up, and avoid gravity damage!

---

## 🛰️ Core Features

1. **Stellar RPG Progression**:
   - **Level Up Mechanics**: Complete tasks to earn XP. Once you reach `Level * 100` XP, you level up, and your HP is fully restored!
   - **Gold Accumulation**: Spendable aurum reserves are rewarded upon quest resolution based on difficulty.
   - **Gravity Penalty Damage**: Deleting or abandoning an active pending quest inflicts **15 HP gravity decay damage**.
   - **Avatar Resurrections**: If your HP drops to 0, your space crest destabilizes! You are reconstructed back at Level 1, lose 50% of your current Gold as an emergency teleport fee, and are restored to 100 HP.

2. **Cosmic Glassmorphism Aesthetics**:
   - Deep space backgrounds featuring rotating orbital elements, glowing stellar crests, and pulsing nebulae.
   - Rich glassmorphism grids powered by Tailwind v3 backdrop-blur and customized borders.
   - Live character-stats dashboard (HP bar with low-health alert pulsing, XP progress indicator, and spinning golden aurum reserves).

3. **Zero-Gravity (Antigravity) Floating Cards**:
   - Performance-tuned pure CSS floating animations that shift up and down.
   - ID-seeded animation hashes so that cards float **out-of-phase with each other**, creating a realistic, organic space debris atmosphere.
   - Framer Motion exit transitions: when a quest is resolved, the card scales down, rotates, and floats upwards out of view, mimicking zero-g ejection.

4. **Cockpit Event Logs**:
   - An active terminal monitor showing you exact timestamp logs of in-game events, status reports, and quantum transitions.

5. **Cosmic Simulation Mode (MongoDB Fallback)**:
   - Includes automatic connection fallback! If MongoDB is not running locally on your computer, the backend switches into **Simulation Mode** using an in-memory storage array. 
   - **You can run and test the app immediately out-of-the-box!**

---

## 🛠️ Project Structure

```text
mern-task/
├── backend/                  # Express.js MERN Backend API
│   ├── models/
│   │   ├── User.js          # Mongoose RPG Player Schema
│   │   └── Task.js          # Mongoose Quest Schema
│   ├── package.json         # Express Server configuration
│   └── server.js            # Express API endpoints & RPG progression algorithms
├── frontend/                 # Vite + React Frontend Client
│   ├── src/
│   │   ├── components/      # Glassmorphism widgets & panels
│   │   │   ├── StatsPanel.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── App.jsx          # Master Coordinator & API integrations
│   │   ├── index.css        # Cosmic backdrop, scrollbars & Tailwind imports
│   │   └── main.jsx
│   ├── package.json         # React client configuration
│   ├── tailwind.config.js   # Tailored HSL theme colors & custom keyframes
│   └── postcss.config.js
├── package.json              # Monorepo coordinator
└── README.md                 # Flight Manual (This file)
```

---

## 🚀 Speedrun Setup (Getting Started)

We've configured a root-level orchestrator that allows you to install and boot the complete stack with single-line commands.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Optional! If MongoDB is offline, the system boots into **Cosmic Simulation Mode** on in-memory structures so you can play immediately).

### 1. Install Dependencies
Run this single command at the root directory of the workspace:
```bash
npm run install:all
```
*This command will install the root controller, then automatically trigger standard package resolutions in `backend/` and `--legacy-peer-deps` package resolutions in `frontend/`.*

### 2. Launch the Galactic Environment
Once installation finishes, execute the following command at the root directory:
```bash
npm run dev
```
*This starts both the Express server API (port 5000) and the Vite React app (port 5173) concurrently in a single terminal!*

### 3. Open the Cockpit
Point your browser to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## ⚔️ Quest Rewards & Balancing Sheet

| Quest Sector (Difficulty) | XP Reward | Gold Awarded | Danger Level (HP Penalty if Aborted) |
| :--- | :---: | :---: | :---: |
| **Easy** (Terrestrial Sector) | +10 XP | +5 Gold | -15 HP |
| **Medium** (Nebular Sector) | +20 XP | +10 Gold | -15 HP |
| **Hard** (Void Core) | +45 XP | +25 Gold | -15 HP |
| **Epic** (Event Horizon) | +100 XP | +60 Gold | -15 HP |

---

🌌 **Good luck, Adventurer! May your orbits remain stable and your quests resolve flawlessly!**
