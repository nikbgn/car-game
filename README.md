# Lane Rush

3-lane endless car dodge game built with **Next.js**, **TypeScript**, and **React Three Fiber**.

Dodge traffic, collect coins, and beat your best score. No backend — best score saved in `localStorage`.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Push this folder to a Git repo (or import directly in Vercel).
2. Framework preset: **Next.js**
3. Deploy — no environment variables required.

## Controls

| Platform | Input |
|----------|-------|
| Desktop | ← → arrow keys (A/D also work) |
| Mobile | Swipe left / right (portrait) |

## Project structure

```
app/              Next.js pages
components/       R3F scene, UI, game logic
hooks/            keyboard, swipe, game state
lib/              constants, collision, storage, audio stubs
public/models/    GLB assets used in-game
```

## Assets

In-game models live in `public/models/` (Kenney CC0, copied from Car Kit):

| Path | Used for |
|------|----------|
| `player/hatchback-sports.glb` | Player car |
| `obstacles/delivery.glb` | Obstacle |
| `obstacles/taxi.glb` | Obstacle |
| `obstacles/truck.glb` | Obstacle |
| `obstacles/cone.glb` | Obstacle |

Road and grass are procedural geometry (`Highway.tsx`), not GLB models.

## v1 scope

- [x] 3 lanes, fixed scroll speed
- [x] Obstacle & coin pooling
- [x] Lane + Z collision
- [x] Score + localStorage best
- [x] Start / HUD / game over UI
- [x] AudioManager stubs (no sounds yet)
- [ ] Audio files (v2)
- [ ] Speed ramp / power-ups (v2)
