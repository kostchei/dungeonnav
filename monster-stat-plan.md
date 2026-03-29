# DungeonNav Plan: Monster Stat Mapping

## Status

Planning only. This document defines the first enemy stat and behavior mappings for the PlayCanvas Caves of Chaos prototype.

## Purpose

Create a compact, implementable monster-spec document for the first two cave areas:

- `A Kobold Lair`
- `D Goblin Lair`

The goal is to preserve a reasonable 5e feel while translating the monsters into a first-person browser game with hidden rolls, readable feedback, and encounter-driven behavior.

## Rules Translation Principles

These monster entries are not intended to be literal copy-pastes of tabletop stat blocks. They are game-ready mappings guided by 5e assumptions.

Core translation rules:

- attacks resolve as hidden `d20 + attack bonus` versus Armor Class
- hit points are authored per creature, using 5e-inspired durability
- melee attacks require range and facing checks before a hidden attack roll resolves
- ranged attacks require line of sight and projectile or shot resolution
- damage uses 5e-style damage expressions internally
- crits use natural 20 logic
- player-facing feedback stays simple even when the hidden rules are more detailed

Player-facing combat feedback:

- `Miss!`
- blood spray or impact burst on hit
- `Critical Hit!`

## Prototype Combat Assumptions

To make these monsters work well in first-person:

- weak creatures should die quickly but threaten through numbers
- bosses should be dangerous without becoming damage sponges
- creatures with low AC should still be scary if they close distance or swarm
- creatures with gimmicks should use a small number of readable special behaviors

## Cave A: Kobold Lair

Faction identity:

- trap-aware tunnel fighters
- weak individually
- dangerous when swarming or throwing from cover
- pressure the player through attrition, movement, and numbers

## Cave A v1 Encounter Budget

For the first playable implementation, Cave A should be scoped as the level-to-2 dungeon slice.

Locked v1 encounter budget:

- `8` kobolds at `25 XP` each
- `2` giant centipedes at `50 XP` each

This means Cave A alone can serve as the first progression milestone for Thrud.

Recommended v1 exclusions:

- pit trap
- copper dragon wyrmling

These can be added later once the core combat and level-up loop is stable.

## Kobold

Role:

- basic skirmisher

Encounter use:

- pairs and trios
- tunnel ambushers
- ranged chip damage

Recommended prototype stats:

- Armor Class: 12
- Hit Points: 5
- Speed: fast light-footed movement
- Attack Bonus: +4 melee, +4 ranged
- Damage: light weapon or sling damage in the low range
- Damage Type: piercing or bludgeoning
- Threat Level: low alone, moderate in groups

Behavior mapping:

- prefers to engage in groups
- will backpedal after melee contact if space allows
- uses ranged harassment when line of sight is clear
- becomes bolder when the player is already engaged by another kobold

5e-style traits to preserve:

- pack pressure
- low durability
- competent accuracy for a weak creature

Recommended browser-game implementation:

- one melee profile and one ranged profile
- short reaction bark on spotting Thrud
- quick sidestep or retreat after attack if not cornered

## Kobold Chieftain

Role:

- small boss or encounter leader

Encounter use:

- final room commander
- supported by normal kobolds

Recommended prototype stats:

- Armor Class: 14
- Hit Points: 27 to 35
- Speed: standard humanoid movement
- Attack Bonus: +5 melee, optional +4 ranged
- Damage: moderate melee spike for a low-tier leader
- Damage Type: slashing or piercing
- Threat Level: moderate, rises sharply with minions

Behavior mapping:

- stays behind basic kobolds at first
- commits once Thrud closes or enough allies fall
- may call or buff nearby kobolds through morale behavior rather than explicit spellcasting

Special mechanics:

- leadership aura style bonus for nearby kobolds
- stronger crit threat presentation
- possible shove or dirty-fighting move in tight rooms

Recommended implementation:

- nearby kobolds gain attack confidence or reduced flee chance while the chieftain lives
- on death, lesser kobolds have a chance to panic, scatter, or lose aggression

## Giant Rat

Role:

- nuisance melee creature

Encounter use:

- clutter fights in side tunnels
- diseased-feeling pressure creature
- supports kobolds by forcing close-range attention

Recommended prototype stats:

- Armor Class: 12
- Hit Points: 6 to 8
- Speed: fast scuttling movement
- Attack Bonus: +4 melee
- Damage: light bite damage
- Damage Type: piercing
- Threat Level: low individually, moderate in packs

Behavior mapping:

- rushes aggressively
- prefers flanking approach when multiple rats are active
- no ranged capability

Optional trait:

- on hit, small chance of a minor debuff later if disease systems are added

Recommended v1 simplification:

- skip disease effects in the first playable unless status systems already exist

## Giant Centipede

Role:

- low-health hazard creature

Encounter use:

- side chamber surprise
- corridor pressure that punishes careless rushing

Recommended prototype stats:

- Armor Class: 13
- Hit Points: 4 to 6
- Speed: quick skittering movement
- Attack Bonus: +4 melee
- Damage: very light bite damage
- Damage Type: piercing plus poison rider if enabled
- Threat Level: low individually, higher if encountered while kobolds are active

Behavior mapping:

- closes quickly once awakened
- relies on surprise and narrow terrain
- dies fast but can punish overconfidence

Recommended v1 simplification:

- use a simple poison-damage rider or short debuff only if status feedback is already clear
- otherwise keep it as a fragile melee hazard worth `50 XP`

## Copper Dragon Wyrmling

Role:

- major lair boss
- central crisis encounter

Encounter use:

- unique room encounter
- social-combat possibility before full battle

Recommended prototype stats:

- Armor Class: 16
- Hit Points: 40 to 55
- Speed: ground mobile with short aerial repositioning if flight is supported
- Attack Bonus: +5 melee, breath attack uses save-based resolution
- Damage: high for the prototype tier
- Damage Type: piercing for bite, acid or slowing breath-style effect depending on design choice
- Threat Level: high

Behavior mapping:

- does not fight like a brute
- repositions and punishes frontal rushing
- mixes bite attacks with a special breath attack
- uses taunts, warning barks, or negotiation beats if narrative framing supports it

Recommended first-pass boss mechanics:

- bite attack for close pressure
- breath cone or line attack on cooldown
- short reposition jump, hop, or hover burst instead of full complex flight if needed
- threshold behavior at low health

Recommended simplification:

- if true dragon flight is expensive, treat the wyrmling as mostly ground-based with brief scripted elevation moves

Good save-based special:

- slowing breath or control breath that creates a temporary movement penalty

This makes the fight feel distinct without requiring overwhelming raw damage.

## Cave D: Goblin Lair

Faction identity:

- more disciplined and malicious than kobolds
- more willing to rush, flank, and exploit openings
- better room defenders

## Goblin

Role:

- basic raider

Encounter use:

- cover shooters
- knife rushers
- room defenders

Recommended prototype stats:

- Armor Class: 15
- Hit Points: 7
- Speed: agile humanoid movement
- Attack Bonus: +4 melee, +4 ranged
- Damage: light weapon or shortbow damage
- Damage Type: slashing or piercing
- Threat Level: moderate in numbers

Behavior mapping:

- uses cover more willingly than kobolds
- fires from mid-range, then shifts position
- may rush a distracted player

5e-style trait to preserve:

- slippery survivability and opportunistic movement

Recommended browser-game implementation:

- quick lateral movement after firing
- strong use of corners and doorways
- chance to disengage and re-aim rather than stand still

## Goblin Boss

Role:

- lair leader

Encounter use:

- boss of the goblin cave
- command-style encounter with bodyguards

Recommended prototype stats:

- Armor Class: 16
- Hit Points: 24 to 32
- Speed: standard humanoid movement
- Attack Bonus: +5 melee, +5 ranged
- Damage: moderate but not brute-force heavy
- Damage Type: slashing or piercing
- Threat Level: moderate-high with support

Behavior mapping:

- fights more cleverly than the kobold chieftain
- uses room layout, bodyguards, and retreat lines
- may reposition after attacking instead of standing toe-to-toe

Special mechanics:

- command shout that briefly sharpens nearby goblin aggression
- emergency retreat phase toward treasure room or mimic chamber if injured

Recommended implementation:

- treat him as a mobile leader, not a stationary duel boss

## Mimic

Role:

- ambush monster

Encounter use:

- disguised treasure encounter
- surprise punish for greedy or careless interaction

Recommended prototype stats:

- Armor Class: 12
- Hit Points: 50 to 65
- Speed: slow once revealed
- Attack Bonus: +5 melee
- Damage: heavy pseudopod or bite damage for this prototype tier
- Damage Type: bludgeoning or piercing
- Threat Level: high in close quarters

Behavior mapping:

- starts inactive in disguised state
- reveals on approach, interaction, or pickup attempt
- punishes point-blank players
- weak at pursuit but extremely dangerous if fought in a cramped room

Special mechanics:

- adhesive or sticking effect on close contact
- surprise attack on reveal
- slow but punishing follow-up attacks

Recommended v1 simplification:

- if true grapple logic is too much for the first slice, replace adhesive with a brief movement slow or delayed disengage

## Cross-Faction Mapping Notes

## Relative Difficulty

Recommended difficulty ordering:

1. Giant Rat
2. Kobold
3. Goblin
4. Kobold Chieftain
5. Goblin Boss
6. Mimic
7. Copper Dragon Wyrmling

The exact ordering of the top three boss-tier creatures depends on encounter space and support units.

## Armor Class Readability

In a first-person game, high AC should not feel like the weapon is broken.

Recommended rule:

- keep low-tier enemy AC within a narrow readable range
- use behavior, numbers, and room geometry to create difficulty more than extreme AC inflation

Suggested prototype range:

- weak creatures: AC 12 to 15
- leaders and bosses: AC 14 to 16

## Hit Point Readability

HP should support encounter rhythm.

Recommended rule:

- fodder enemies die in 1 to 3 solid hits
- leaders survive long enough to use at least one special pattern
- bosses survive long enough to change the rhythm of the fight

## Suggested First Implementation Order

Implement in this order:

1. Kobold
2. Giant Rat
3. Goblin
4. Kobold Chieftain
5. Goblin Boss
6. Mimic
7. Copper Dragon Wyrmling

Why:

- it builds from simple melee and ranged grunts
- adds leader logic second
- reserves special ambush and boss mechanics for after the core combat loop is stable

## Data Model Recommendation

Each monster should have a compact data entry with fields like:

- `id`
- `displayName`
- `faction`
- `armorClass`
- `hitPoints`
- `speed`
- `attackBonus`
- `damage`
- `damageType`
- `attackRange`
- `attackArc`
- `behaviorRole`
- `specialTraits`
- `aggroRange`
- `lootTable`

Boss-capable extras:

- `phaseThresholds`
- `encounterIntro`
- `onDeathEffect`
- `minionMoraleEffect`

## Recommended Next Step

After this document, the next useful planning artifact is one of:

- a `vertical-slice-spec.md` for the kobold cave and goblin cave
- a `combat-resolution-spec.md` covering attack rolls, crits, Rage, and cleave
- a `monster-data-schema.md` defining the exact JSON or script format for implementation

## Bottom Line

These two cave groups are enough to build the first practical DungeonNav bestiary.

They provide:

- weak swarmers
- ranged harassment
- small leaders
- an ambush monster
- a true boss encounter

That is enough variety to validate the first-person 5e-style combat model before expanding into the rest of the Caves of Chaos.
