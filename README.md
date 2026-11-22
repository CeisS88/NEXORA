# NEXORA — 360° Endless Tunnel Racer 🌀

A fast-paced, endless 360° tunnel racing game built with Vanilla HTML, CSS, and JavaScript. Steer along the entire inner wall of a twisting, rotating tube, weave through narrowing gates, collect orbs, chain near-miss combos, and phase straight through obstacles.

## ✨ Features
- **360° Tunnel Racing:** The entire inner wall is your road. The camera rolls smoothly as you steer around the tube while the tunnel winds and twists ahead.
- **Pseudo-3D Canvas Rendering:** Drawn entirely with the HTML5 Canvas 2D API featuring depth-sorted rings, perspective projection, atmospheric fog, speed streaks, and a soft light at the end of the tunnel.
- **Dynamic Gates:** Single and double gaps—some rotating—that progressively narrow as you advance through the run.
- **Phase Shift Mechanic:** Slip through gates temporarily (`1.6 s` duration, costs `30` Phase energy, followed by a `4.5 s` cooldown so it cannot be spammed).
- **Combo & Near-Miss Scoring:** Build a streak multiplier from `×1` up to `×5` with bonus points for near-misses, orbs, boost pads, and stage milestones.
- **Gradual 9-Stage Difficulty:** Progress across nine stages from wide gaps and steady speeds to narrow, fast, spinning gates. Choose between **Easy**, **Normal**, or **Hard** on the start screen.
- **Multilingual Support (4 Languages):** Switch seamlessly between **Bahasa Indonesia**, **English**, **中文**, and **日本語** from the start screen. Browser language is auto-detected on first launch and your choice is remembered.
- **Desktop & Mobile Ready:** Supports both keyboard and touch controls with a responsive, safe-area-aware layout.
- **Zero Dependencies & Synthesized Audio:** Built with no frameworks and no external assets—all sound effects are procedurally synthesized via the Web Audio API.

## 🎮 How to Play & Controls

| Action | Keyboard | Touch |
| :--- | :--- | :--- |
| **Steer** | `←` `→` or `A` `D` | Hold the left or right half of the screen |
| **Phase Shift** | `↑`, `W`, or `Space` | Tap the **Phase** button |
| **Start / Restart** | `Space` or **Start** button | Tap the **Start** button |

- **Lives & Recovery:** You start each run with **3 lives**. Crashing into a barrier costs one life and grants brief invulnerability.
- **Phase Energy:** The Phase meter (`0–100`) charges by collecting orbs and skimming past gates for near-misses. Activating Phase costs `30` energy and triggers a `4.5 s` cooldown (holding the key down will not repeat Phase).

## 🏆 Scoring System

| Event | Base Points | Streak Bonus |
| :--- | :---: | :---: |
| **Clear a gate** | `100` | `+1` |
| **Near-miss (skim the edge of a gap)** | `250` | `+2` |
| **Collect an orb** | `50` | — |
| **Hit a boost pad** | `150` | — |
| **Reach a new stage** | `300` | — |
| **Phase through a gate** | `50` | — |
| **Distance travelled** | Continuous bonus | — |

- **Streak Multiplier:** Every **4 streak points** raises your score multiplier by one, up to **`×5`**. Crashing resets the multiplier back to **`×1`**.
- **Difficulty Scaling:** All points are multiplied by your active streak multiplier and selected difficulty factor (**Easy** `≈ ×0.88`, **Normal** `×1.00`, **Hard** `≈ ×1.16`).

## 🛠️ Tech Stack
- **HTML5:** Semantic document structure, HUD overlay, start screen, and language selector.
- **CSS3:** Custom properties (colour tokens), responsive viewport scaling, safe-area insets, and typography.
- **JavaScript (ES6+):** Pseudo-3D rendering engine, collision and scoring logic, i18n dictionary, keyboard/touch input handling, `localStorage` persistence, and Web Audio API synthesizer.
- **Typography:** `Syncopate`, `Josefin Sans`, and `Noto Sans SC/JP` with automatic system font fallback when offline.

## 📁 Project Structure
```text
nexora/
│
├── index.html      # Main HTML markup: HUD, start screen, and language menu
├── style.css       # Layout, responsive design, typography, and colour tokens
├── game.js         # Game engine, pseudo-3D rendering, scoring, i18n, and audio
└── README.md       # Project documentation
```
