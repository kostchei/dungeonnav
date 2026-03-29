# Local PlayCanvas Hosting And Test Plan

## Purpose

Define the local workflow for hosting and testing a PlayCanvas game during development.

This repo now contains a local PlayCanvas alpha scaffold, so this document covers:

- how to serve a local browser build
- what manual checks to run
- what automated logic tests should exist alongside the game

## Local Hosting Rule

Do not open the game with `file://`.

Always serve it through `http://localhost` so:

- assets load correctly
- browser security restrictions do not block scripts or audio
- pointer lock behaves normally
- fetch and relative asset paths behave like deployment

## Local Server Options

## Option 1: PlayCanvas Editor Preview

Use the PlayCanvas cloud editor preview when:

- testing scene edits
- testing script changes already synced to PlayCanvas
- quickly validating controls, lighting, and asset placement

## Option 2: Local Vite Dev Server

Use the dev server when:

- iterating on gameplay code
- testing browser behavior outside the editor
- validating hot-reload and runtime errors quickly

Run:

```powershell
cd D:\Code\DungeonNav
npm run dev
```

Default local URL:

```text
http://127.0.0.1:5173
```

## Option 3: Local Production Build

Use a production build when:

- checking bundling issues
- validating the final browser output
- verifying that development-only behavior is not masking errors

Build and preview:

```powershell
cd D:\Code\DungeonNav
npm run build
npm run preview
```

## Option 4: Static Server For Exported Builds

The repo still includes a simple static server:

```powershell
cd D:\Code\DungeonNav
npm run serve:local
```

That is useful for exported or copied static builds placed in `demo/`.

## Manual Local Test Checklist

Run these checks whenever there is a playable browser build.

## Boot And Hosting

- the page loads from the expected localhost URL
- no 404s appear in the Network tab for scripts, textures, audio, or models
- no blocking errors appear in the Console at startup
- the loading state completes without hanging

## Controls

- pointer lock activates on click
- mouse look feels stable
- WASD movement works
- sprint works
- interact works
- pause works
- restart works after death or completion

## Combat

- greataxe attack input works reliably
- hit, miss, and crit feedback appear correctly
- kobolds can attack in melee and at range
- centipedes rush correctly
- damage applies correctly to player and enemies
- Rage state behaves correctly

## Progression

- enemy deaths award XP
- total XP reaches `300` by full clear
- the future level 2 transition seam remains valid
- no level progression state is lost on pause or completion

## Encounter Flow

- each room wakeup triggers once
- all required enemies spawn
- final treasure can be collected
- completion trigger fires only after required progress is met
- the level cannot softlock

## Presentation

- HUD values update correctly
- audio starts after user interaction
- impact VFX play
- cave ambience loops correctly
- lighting is readable in dark spaces

## Browser Coverage

Minimum local browser checks:

- Chrome or Edge
- Firefox if supported

Run the same level clear in both browsers before calling the build stable.

## Automated Test Scope

Automated tests should cover the deterministic logic that does not need the browser renderer:

- XP progression
- attack resolution
- damage expression parsing and rolling
- Rage mitigation
- encounter XP totals
- future level unlock flags such as `recklessAttack`

These tests should run with:

```powershell
cd D:\Code\DungeonNav
npm test
```

## Debug Workflow

Use browser DevTools during local testing:

- Console for runtime errors
- Network for missing assets
- Performance for frame spikes
- Application or Storage for any local persistence added later

## Exit Criteria For A Local Playtestable Build

The build is ready for local playtesting when:

- it boots from `localhost`
- the level can be cleared start to finish
- death and restart work
- all required HUD values update correctly
- no critical console errors appear
- automated tests pass
