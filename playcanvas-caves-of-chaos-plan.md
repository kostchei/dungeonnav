# DungeonNav Plan: PlayCanvas Caves of Chaos Level 1 Demo

## Status

Planning only. This document is the implementation plan for the first playable level only.

## Goal

Ship one browser-playable PlayCanvas level built around `Cave A: Kobold Lair`.

The level exists to prove:

- first-person cave exploration
- barbarian greataxe combat
- hidden 5e-style hit and damage resolution
- kobold group pressure
- giant centipede rush hazards
- XP gain through the level 1 slice

The level is successful if a player can start outside the cave, clear the kobold lair, reach level 2, collect the treasure reward, and complete the level.
The level is successful if a player can start outside the cave, clear the kobold lair, collect the treasure reward, and complete the level with the progression system ready to transition into level 2 after the demo slice is proven.

## Scope Lock

Included:

- exterior cave approach
- `Cave A: Kobold Lair`
- `8` kobolds
- `2` giant centipedes
- greataxe melee combat
- one simple ranged fallback
- Rage
- XP tracking for the level 1 slice
- pickups
- treasure reward
- death, restart, and completion flow
- placeholder or kitbashed assets
- desktop keyboard and mouse support

Explicitly excluded:

- ogre chamber
- all later caves and factions
- bosses
- traps
- copper dragon wyrmling
- playable level 2 content
- inventory grid
- dialogue systems
- build choices
- persistent save system
- multiplayer
- mobile controls

## Level Experience

## Player Start

The player begins outside the kobold cave with:

- greataxe equipped
- level 1 stats
- limited thrown-weapon ammo
- full health

## Core Run

1. approach the cave entrance
2. enter the lair and clear early kobold pressure
3. survive side-room fights with mixed kobold and centipede threats
4. clear the main lair chamber
5. collect treasure
6. complete the level

## Win Condition

The level is complete when:

- all required encounters are cleared
- the treasure reward is collected
- the completion trigger is reached

## Fail State

- Thrud dies and restarts the level

## Encounter Plan

Locked encounter budget:

- `8` kobolds at `25 XP` each
- `2` giant centipedes at `50 XP` each

Locked XP total:

- kobolds: `200 XP`
- giant centipedes: `100 XP`
- total: `300 XP`

Future level threshold:

- level 2 at `300 XP`

For the first demo, XP should still be tracked against this threshold, but the actual level 2 upgrade flow can remain gated until the base level is stable.

## Enemy Roles

- Kobold: weak but accurate skirmisher with melee and thrown attacks
- Giant Centipede: fragile rush hazard that punishes careless pushes

## Player Loadout

Required:

- greataxe
- one ranged fallback: thrown axe or javelin

Recommended:

- thrown axe, because it fits Thrud and keeps scope tight

## Pickups

Required:

- health pickups
- ammo pickups
- treasure reward

Optional:

- one bonus consumable near the final room

## Core Systems Required

## 1. Scene Flow

Needed:

- boot and loading
- gameplay scene
- death overlay
- completion overlay
- restart flow
- pause handling

Acceptance:

- the player can launch, complete, fail, and restart without reloading the page

## 2. First-Person Controller

Needed:

- mouse look
- WASD movement
- sprint
- interact
- pointer lock
- stable collision against cave geometry

Acceptance:

- movement is reliable in corridors, thresholds, and small chambers

## 3. Player State

Needed:

- health
- alive or dead
- Rage active
- level
- XP
- ranged ammo
- attack cooldown state

Acceptance:

- all level progression and combat state survives correctly through the full run

## 4. Melee Combat

Needed:

- primary greataxe attack
- optional heavy attack only if cheap enough
- hit timing window
- melee arc and range test
- hidden attack roll versus AC
- hidden damage roll
- crit on natural 20
- miss, hit, and crit feedback
- enemy hit reaction

Acceptance:

- melee combat feels dependable and readable in first person

## 5. Ranged Combat

Needed:

- simple player throwable
- kobold ranged attack
- ammo tracking
- projectile collision or authored hit resolution
- impact feedback

Acceptance:

- kobolds can pressure at range and the player has a limited answer

## 6. Rules Layer

Needed:

- `d20 + attack bonus vs Armor Class`
- damage expression resolution
- crit rule
- Rage melee bonus
- Rage physical mitigation
- authored enemy AC, HP, attack bonus, damage, move speed

Acceptance:

- combat rules are tunable from data and not buried in scene logic

## 7. Enemy AI

Needed states:

- idle
- alert
- chase
- attack
- stagger
- dead

Needed behaviors:

- kobold ranged harass
- kobold close pressure
- kobold retreat or sidestep after attack if room allows
- centipede fast rush

Acceptance:

- kobolds and centipedes play differently and support the intended room tactics

## 8. Encounter Management

Needed:

- trigger-based encounter wakeups
- room-based spawn placement
- room clear tracking
- level completion trigger after final room and treasure

Acceptance:

- the level can be completed in authored order without softlocks

## 9. Progression

Needed:

- XP gain on kill
- level threshold check
- stored transition to level 2 stats
- deferred level-up presentation hook

Future level-up reward:

- HP from `18` to `31`
- small melee damage bump
- small recovery or movement improvement

Acceptance:

- the demo tracks XP correctly and can switch cleanly into level 2 stats once that follow-on work is enabled

## 10. Future Level 2 Hook

This is not part of the first playable completion target, but the level 1 implementation should leave a clean seam for it.

Required follow-on support:

- a stat transition from level 1 to level 2 at `300 XP`
- a dedicated `Reckless Attack` input
- temporary self-vulnerability state when Reckless Attack is used
- stronger hit chance or equivalent attack advantage behavior

Recommended implementation rule:

- do not ship full Reckless Attack behavior before the base demo combat is stable
- reserve one input path now so the control scheme does not need to be redesigned later

## 11. Pickups and Interactables

Needed:

- health pickup
- ammo pickup
- treasure interaction
- one simple door or gate interaction if the level layout needs it

Acceptance:

- the level uses at least one non-combat interaction

## 12. UI

Required HUD:

- health
- Rage indicator
- level
- XP and next threshold
- ammo
- crosshair
- combat feedback text

Required overlays:

- controls prompt
- pause
- death
- level complete

Acceptance:

- a new player can understand health, ammo, XP, and progression state without outside explanation

## 13. Audio and Feedback

Needed:

- axe swings and impacts
- kobold hurt and death sounds
- centipede hurt and death sounds
- projectile throw and hit sounds
- cave ambience
- pickup sound
- level-up cue

Needed visual feedback:

- blood or impact burst
- miss text
- crit text
- pickup feedback
- level-up burst
- warm cave lighting

Acceptance:

- hits, misses, pickups, and level-up all read immediately

## Data and Content Components

Required data groups:

- `playerStats`
- `playerProgression`
- `weapons`
- `enemyDefs`
- `encounters`
- `pickups`
- `levelMeta`
- `audioMap`
- `vfxMap`

Each enemy entry should support:

- `id`
- `displayName`
- `faction`
- `armorClass`
- `maxHp`
- `moveSpeed`
- `attackBonus`
- `damageExpression`
- `damageType`
- `attackRange`
- `attackArc`
- `aggroRange`
- `behaviorRole`
- `specialTraits`
- `xpValue`

Each encounter entry should support:

- `id`
- `areaId`
- `spawnPoints`
- `enemyList`
- `wakeTrigger`
- `clearRewards`
- `nextUnlock`

The progression data should already support:

- `level`
- `xpThreshold`
- `maxHp`
- `meleeBonus`
- `unlockFlags`

`unlockFlags` should be able to turn on `recklessAttack` later without refactoring the whole player state model.

## Level Design Plan

## Exterior Approach

Purpose:

- establish tone
- teach controls
- frame the cave entrance

Contents:

- cave mouth
- one early pickup
- first threat sightline

## A1 Entrance Threshold

Purpose:

- first caution beat

Contents:

- one visible kobold scout
- transition from exterior to cave lighting

## A2 Central Connector

Purpose:

- teach corridor fallback tactics

Contents:

- one kobold guard
- sightlines into adjacent rooms

## A3 West Chamber

Purpose:

- first side-room pressure fight

Contents:

- `2` kobolds
- `1` giant centipede
- small health pickup

## A5 North Chamber

Purpose:

- reinforce mixed pressure and poor spacing risk

Contents:

- `2` kobolds
- `1` giant centipede
- ammo pickup

## A4 East Chamber

Purpose:

- main lair climax

Contents:

- `2` kobolds guarding the treasure side
- treasure reward
- likely level-up moment during or just after this fight

## Technical Architecture

## PlayCanvas Owns

- rendering
- cameras
- scene hierarchy
- animation playback
- collision primitives
- input plumbing
- audio playback
- asset loading

## Game Code Owns

- combat resolution
- Rage
- XP and level-up
- enemy state machines
- encounter sequencing
- pickups
- completion logic
- UI state

## Recommended Code Modules

- `app/bootstrap`
- `core/game-state`
- `core/config`
- `player/player-controller`
- `player/player-combat`
- `player/player-progression`
- `combat/combat-resolver`
- `combat/projectiles`
- `ai/enemy-brain`
- `ai/enemy-factory`
- `ai/behaviors`
- `world/encounter-manager`
- `world/pickups`
- `world/interactables`
- `ui/hud`
- `ui/overlays`
- `data/*.json`

## Asset Components Needed

## Environment

- cave wall materials
- cave floor and ceiling materials
- exterior ground material
- rock props
- torch or brazier prop
- kobold clutter props
- treasure prop

## Characters

- first-person Thrud arms and greataxe
- kobold model
- giant centipede model

Minimum enemy animations:

- idle
- move
- attack
- hit react
- death

## Effects

- blood burst
- dust hit
- thrown projectile mesh
- impact effect
- pickup glow
- level-up burst

## UI Assets

- HUD treatment
- crosshair
- Rage icon
- pickup icons

## Build Order

## Milestone 0: Foundation

Build:

- PlayCanvas app setup
- first-person controller
- one greybox room
- greataxe hit detection
- health and death loop

Success condition:

- movement, combat, damage, and restart work in browser

## Milestone 1: Combat Core

Build:

- combat resolver
- Rage
- kobold enemy
- giant centipede enemy
- player throwable
- basic HUD

Success condition:

- a combat test room with kobolds and centipedes is fully playable

## Milestone 2: Full Level 1

Build:

- exterior and cave rooms
- encounter triggers
- pickups
- XP and level-up
- treasure completion
- lighting and ambience pass

Success condition:

- the kobold lair can be completed from start to finish and reliably levels the player to 2

## Milestone 3: Polish

Build:

- audio pass
- impact VFX pass
- encounter tuning
- UI cleanup
- bug fixing
- performance pass

Success condition:

- the level is stable enough for playtesting

## Production Checklist

- browser boot is reliable
- pointer lock works cleanly
- controls are explained once
- all encounters can be cleared
- total XP reaches `300`
- level 2 transition data is valid even if the upgrade is not yet player-facing
- treasure completion always fires
- death and restart work every time
- no critical missing asset breaks the build
- performance is acceptable on a target desktop browser

## Acceptance Criteria

## Feel

- melee feels heavy
- kobolds are dangerous in groups
- centipedes punish reckless pushes
- corridors matter tactically
- the XP bar clearly points toward the future level 2 transition

## Content

- first clear takes about `8` to `12` minutes
- there are at least `3` distinct encounter beats
- the final chamber feels like a payoff

## Technical

- no encounter depends on brittle timing hacks
- combat math is data-authored
- no critical path requires dev console interaction

## Main Risks and Controls

## Risk 1: Weak Melee Feel

Control:

- get greataxe timing and hit response right before full level assembly

## Risk 2: Scope Drift

Control:

- hold the level to kobolds, centipedes, and treasure only

## Risk 3: Asset Burden

Control:

- use placeholders and keep the enemy roster small

## Risk 4: AI Overbuild

Control:

- implement only the behaviors needed for kobolds and centipedes

## Rough Effort

Assuming one experienced developer with placeholder assets:

- foundation: 3 to 5 days
- combat core: 4 to 7 days
- full level build: 4 to 7 days
- polish and tuning: 3 to 5 days

Estimated total:

- about 2 to 4 weeks for a credible level 1 demo

## Recommended Next Artifacts

- `vertical-slice-spec.md` for exact room placements and trigger logic
- `combat-resolution-spec.md` for hit, crit, damage, and Rage math
- `monster-data-schema.md` for enemy implementation format

## Bottom Line

The first PlayCanvas demo should be only level 1:

- exterior approach
- kobold cave
- `8` kobolds
- `2` giant centipedes
- treasure reward
- level-up to 2

That is the smallest slice that still proves the game.
