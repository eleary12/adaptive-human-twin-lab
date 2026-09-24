# Adaptive Human Twin Lab

Adaptive Human Twin Lab is a static 3D web app that simulates a virtual human moving through changing environmental conditions. It visualizes:

- A long-distance runner test profile with an endurance-focused physiological model
- Three active CC0 panoramic environments covering desert, mountain, and humid flatland running
- A locally generated articulated runner with an alternating hip, knee, ankle, shoulder, and elbow gait cycle
- A closed feedback loop where human strain can trigger environmental adaptation such as cooling, air support, pacing, and guidance relief
- A layered 3D human with skin, nerves and brain, joints, and skeleton views that can be shown separately or together
- Live controls for environment shifts, human condition shifts, and movement slow motion
- Cognitive performance, physical performance, endurance, hydration, oxygen efficiency, and thermal stress
- Lightweight trend charts that work without a build pipeline

## Why this shape

This project is intentionally static so it can be hosted directly on GitHub Pages without a local JavaScript toolchain. The page uses browser-native ES modules plus a CDN-loaded `three.js` import map.

## Local preview

Because the app uses ES modules, serve the folder with any simple local web server instead of opening `index.html` directly from the filesystem.

Examples:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages deployment

1. Create a new GitHub repository and push this folder.
2. In the repository settings, enable GitHub Pages with the GitHub Actions source.
3. The included workflow will publish the static site automatically on pushes to `main`.

The `.nojekyll` marker ensures GitHub Pages serves the asset folders directly without Jekyll processing.

## Project structure

- `index.html` contains the app shell and import map
- `styles.css` defines the visual system and responsive layout
- `src/app.js` wires the UI, playback loop, and rendering
- `src/simulation.js` contains the agent-based environmental response model
- `src/humanModel.js` builds and animates the 3D human
- `src/charts.js` renders the lightweight dashboard charts
- `assets/` contains the environment captures
- `ASSET_ATTRIBUTION.md` records source and license details

## Notes

This first version is a concept simulator, not a clinical or biomechanical validation model. The response logic is designed to feel plausible and useful for exploration, while staying lightweight enough for a static GitHub Pages deployment.
