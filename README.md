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

W/S throttle/brake, mouse or A/D steer, click/F fire, Space jump, Shift boost. E/R wheelie/endo on the ground and accelerating backflip/frontflip in the air. A/D or left/right arrows spin in the air; up/down arrows pitch; B/N roll. Hold longer to build angular speed. C sharp turn, V camera, X dismount, G remount, M map, L lights, P pause.

Chase camera: middle-mouse drag or Alt + mouse movement to orbit, J/K keyboard orbit, H look behind, T recenter, mouse wheel zoom. The camera smoothly recentres after driving without manual camera input.

The city has 520 pedestrians on pavement routes and zebra crossings. Bike impacts accumulate local cosmetic deformation; damaged machines retain their ride controls. A new run resets damage. On foot, click/F swings the bat.

ImageGen texture prompts are recorded in `texture-prompts.md`.

## Checks

Run `npm test` for pavement/crossing routes, accelerating stunts, orbit recentering, gravity, and cumulative deformation/copy/reset checks.
