# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a personal learning repository ("My First Repository") containing small experiments in Python and HTML/JavaScript. There is no build system, package manager, or test framework.

## Running the Code

**Python script:**
```bash
python PrintingCrap.py
```

**HTML files:** Open directly in a browser — no build step required.
- `index.html` — Interactive AI Revolution infographic (uses Tailwind CSS, Chart.js via CDN; includes a Gemini API integration with an empty `apiKey` placeholder)
- `space.html` — 3D space exploration simulator (uses Three.js r128 via CDN)

## Code Architecture

- **`PrintingCrap.py`** — Declares variables for a game character (name, level, class, stats) and prints them with their types. Edit only the variables above the `# Don't edit below this line` comment.
- **`index.html`** — Single-file SPA with inline CSS, Chart.js charts rendered on `DOMContentLoaded`, modal dialogs controlled by `openModal`/`closeModal` JS functions, and a `callGeminiWithBackoff` function for the Gemini API. The `apiKey` variable is intentionally left empty.
- **`space.html`** — Single-file Three.js scene. The `init()` function sets up the scene and all cosmic objects; the `animate()` loop handles physics, camera follow, and pulsar animation. Mouse drag uses quaternion-based rotation (yaw/pitch) to avoid gimbal lock.
