# Adaptive Human Twin Lab

Adaptive Human Twin Lab is a static 3D web app that simulates a virtual human moving through changing environmental conditions. It visualizes:

- Three athlete-specific human models: a rower, a long-distance runner, and a track sprinter
- Nine local CC0 panoramic environment captures covering snow, fall, summer heat, desert, mountain, humid flatland, rain, and winter track exposure
- A bundled CC0 rigged human model plus replaceable `GLB` or `GLTF` body imports
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

## Scan import

Use the `Body model` panel to replace the built-in human with a `GLB` or `GLTF` scan for the currently selected athlete. A relaxed standing pose or A-pose works best as a static shell over the anatomy overlays. See `ASSET_ATTRIBUTION.md` for the bundled sources and the full-resolution scan reference.

The bundled body is an optimized, rigged CC0 model selected for reliable browser animation. The linked Thunk3D photogrammetry scan is intentionally not bundled because its original two-million-triangle mesh requires an authenticated download and web retopology first.

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
- `assets/` contains the local human model and nine environment captures
- `ASSET_ATTRIBUTION.md` records source and license details

## Notes

This first version is a concept simulator, not a clinical or biomechanical validation model. The response logic is designed to feel plausible and useful for exploration, while staying lightweight enough for a static GitHub Pages deployment.
