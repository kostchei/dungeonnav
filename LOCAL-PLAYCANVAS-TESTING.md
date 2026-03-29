# Local PlayCanvas Hosting And Test Plan

## Purpose

Define the local workflow for hosting and testing a PlayCanvas game during development.

This repo does not yet contain a full PlayCanvas build, so this document covers:

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

## Option 2: Local Static Server

Use a local static server when:

- testing an exported PlayCanvas build
- testing browser behavior outside the editor
- reproducing real asset-loading conditions

This repo includes a simple Node server:

```powershell
cd D:\Code\DungeonNav
npm run serve:local
```

Default URL:

```text
http://localhost:8080
```

## Expected Build Folder

The included local server points at the `demo` folder.

If a PlayCanvas export is added later, place the exported web build there or update the script target.

## Manual Local Test Checklist

Run these checks whenever there is a playable browser build.

## Boot And Hosting

- the page loads from `http://localhost`
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
