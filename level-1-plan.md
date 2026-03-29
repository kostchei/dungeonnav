# Thrud in the Caves of Chaos: Level 1 Plan

## Status

Planning only. This document defines Level 1 of `Thrud in the Caves of Chaos`.

## Level Identity

Level 1 is:

- `Cave A: Kobold Lair`
- the first playable dungeon in the game
- Thrud's introductory combat and exploration test
- the level that carries the player from level 1 to level 2

This level should establish the core promise of the game:

- first-person cave exploration
- brutal melee combat
- dangerous but readable enemy groups
- positional survival through choke points and pullbacks
- hidden 5e-style combat resolution presented with immediate visual feedback

## Primary Goal

Create a complete first dungeon level that teaches the player how Thrud survives:

- by controlling space
- by using Rage to endure weapon damage
- by respecting group attacks
- by retreating when necessary
- by clearing a hostile lair for XP and treasure

## Level Success Criteria

Level 1 is successful if the player can:

- enter the kobold cave and understand the basic objective
- survive several small-scale fights
- learn that narrow passages are tactically valuable
- gain enough XP to reach level 2 by the end of the level
- leave with a clear sense of Thrud's combat identity

## Scope Lock

Included in Level 1:

- kobold cave exterior approach
- interior kobold lair based on the provided Cave A map
- `8` kobolds
- `2` giant centipedes
- treasure reward
- automatic level-up to level 2 from earned XP

Explicitly excluded from Level 1 v1:

- copper dragon wyrmling
- pit trap
- giant rats
- dialogue-heavy social encounter systems
- advanced status conditions beyond what is needed for core combat readability

## XP and Progression Target

Level 1 should bring Thrud from level 1 to level 2.

Locked XP plan:

- `8` kobolds at `25 XP` each = `200 XP`
- `2` giant centipedes at `50 XP` each = `100 XP`
- total = `300 XP`

This total is the designed level-up threshold for the first dungeon slice.

Progression result:

- Thrud enters Level 1 at level 1 with `18 HP`
- Thrud exits or completes the level at level 2 with `31 HP`

## Intended Gameplay Lessons

Level 1 should teach these lessons in order:

1. enemies can overwhelm Thrud if he rushes blindly
2. Rage makes ordinary weapon users survivable, but not harmless
3. corridors and chokepoints are part of the intended tactics
4. ranged harassment matters
5. enemy groups should be split or funneled when possible
6. clearing a lair produces meaningful growth through XP

## Map Use

The provided `Cave A: Kobold Lair` image is the layout reference for Level 1.

Named areas visible on the map:

- `A1` entrance approach
- `A2` central connector
- `A3` west chamber
- `A4` east chamber
- `A5` north chamber

This is a strong first-level layout because it already provides:

- a natural entrance
- a central corridor
- branching room pressure
- defensible fallback lines
- room-based encounter pacing

## Proposed Room Flow

## A1: Entrance Threshold

Purpose:

- transition from outside world to danger zone
- teach the player to look into darkness and approach carefully

Recommended content:

- one visible kobold scout deeper in the cave or just beyond line of sight
- ambient cave sound and a clear visual change in lighting

Design goal:

- create tension without overwhelming the player immediately

## A2: Central Connector

Purpose:

- first real tactical space
- demonstrates how the cave layout funnels combat

Recommended content:

- one kobold guard
- line of sight into future threat zones

Design goal:

- teach the player to use the corridor as a fallback point

## A3: West Chamber

Purpose:

- side-room threat
- early swarm lesson

Recommended content:

- `2` kobolds
- `1` giant centipede

Design goal:

- teach target prioritization
- punish careless overextension in a side chamber

## A5: North Chamber

Purpose:

- pressure room
- mixed positioning encounter

Recommended content:

- `2` kobolds
- `1` giant centipede

Design goal:

- create a slightly more chaotic fight than A3
- force the player to decide whether to hold the doorway or commit inside

## A4: East Chamber

Purpose:

- main lair room
- climactic fight of Level 1

Recommended content:

- `3` kobolds in the main chamber
- `1` additional kobold nearer the approach or treasure side
- treasure reward

Design goal:

- let the player feel pressure from numbers
- create a final defensive stand or aggressive push
- reward smart use of corridors and cleave attacks

## Encounter Pacing

Recommended pacing profile:

- one light warning encounter
- one early side-room spike
- one medium fight with positional pressure
- one final room fight with the largest group

This keeps the level readable and avoids front-loading all danger.

## Combat Expectations

Because Thrud begins with `18 HP`, the level must be built around tactical survivability rather than raw tanking.

Expected player behavior:

- activate or enter Rage immediately in combat
- pull back to narrow corridors
- avoid standing in open room centers when outnumbered
- use cleave to punish clustered enemies

Expected enemy behavior:

- kobolds harass and surround if given room
- centipedes punish careless pushes into side spaces

## Reward Structure

Level 1 should reward both survival and aggression.

Recommended rewards:

- XP from kills
- treasure in the main chamber
- level 2 as the major power reward

Optional reward flavor:

- a named trophy
- a small lore object
- a better consumable or backup ranged item for the next level

## Presentation Goals

Level 1 should strongly communicate:

- crude monster occupation
- filthy bedding, scattered supplies, and bone debris
- torchlit or firelit cave color contrast
- narrow spaces that feel dangerous but readable

The level should feel more like a raider nest than a neutral cave.

## Technical Goals

Level 1 is also the technical validation level for the project.

Systems this level must prove:

- first-person movement and collision
- melee attack resolution
- hidden to-hit and damage rolls
- miss, hit, and critical-hit feedback
- Rage state tracking
- XP tracking
- automatic level-up to level 2
- enemy aggro and room encounters

## Why Level 1 Should Stay Small

This level is not just content. It is the first systems integration test.

Keeping it small allows the team to validate:

- whether the combat math feels right
- whether chokepoint tactics are satisfying
- whether Thrud feels powerful but vulnerable
- whether browser performance remains stable in confined combat spaces

## Deferred Additions

Once the base level works, the following can be considered for a later revision:

- pit trap
- copper dragon wyrmling as an optional boss or sequel encounter
- stronger room scripting
- side secrets
- environmental hazards beyond basic cave traversal

## Recommended Build Order

1. block out the level geometry
2. implement Thrud movement and greataxe combat
3. add kobold enemy behavior
4. add giant centipede behavior
5. place encounters room by room
6. add XP and level-up flow
7. add treasure and completion condition
8. polish lighting, sounds, and feedback

## Bottom Line

Level 1 of `Thrud in the Caves of Chaos` should be the kobold lair.

It is the right first level because it is compact, tactically interesting, and already supports the intended player fantasy:

- dangerous melee-first dungeon crawling
- enemy pressure through numbers
- survival through smart positioning
- meaningful growth through combat-earned XP
