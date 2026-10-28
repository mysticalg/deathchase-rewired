# Deathchase: Rewired

A Three.js browser motorcycle combat game with forest and city arenas, jumps, ramps, stunts, traffic, and a first/third-person camera.

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

## Build and publish

```sh
npm run build
```

The `dist` folder is a static site. The included GitHub Actions workflow automatically publishes `main` to GitHub Pages. Relative asset paths support repository subdirectories.

## Controls

W/S throttle/brake, mouse or A/D steer, click/F fire, Space jump, Shift boost, E/R lean, Q/Z air spin, B/N roll, C sharp spin, V camera, X dismount, G remount, M map, L lights, P pause. On foot, click/F swings the bat.

ImageGen texture prompts are recorded in `texture-prompts.md`.
