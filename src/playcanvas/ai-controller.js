import * as pc from "playcanvas";
import configModule from "../config/level1-data.js";
import { ENCOUNTER_LAYOUT, ENCOUNTER_TRIGGER_ROOMS } from "./layout.js";
import { createBox, createSphere, materials, isInsideWalkableArea, intersectsCollider, getCurrentRoom } from "./scene-builder.js";
import resolverModule from "../combat/resolver.js";
import { AudioManager } from "./audio-manager.js";
import { VfxManager } from "./vfx-manager.js";

const { applyDamageMitigation, resolveAttack } = resolverModule;
const { ENEMY_DEFS, LEVEL_1_ENCOUNTERS } = configModule;
export const enemies = [];

export function spawnEncounters(worldRoot) {
  for (const encounter of LEVEL_1_ENCOUNTERS) {
    const spawnPoints = ENCOUNTER_LAYOUT[encounter.id] || [];
    for (const spawn of spawnPoints) {
      const definition = ENEMY_DEFS[spawn.enemyId];
      const material = spawn.enemyId === "kobold" ? materials.kobold : materials.centipede;
      const scale = spawn.enemyId === "kobold"
        ? { x: 0.7, y: 1.2, z: 0.7 }
        : { x: 0.9, y: 0.45, z: 1.2 };
      const y = spawn.enemyId === "kobold" ? 0.6 : 0.225;
      const entity = spawn.enemyId === "kobold"
        ? createBox(worldRoot, definition.displayName, { x: spawn.x, y, z: spawn.z }, scale, material)
        : createSphere(worldRoot, definition.displayName, { x: spawn.x, y, z: spawn.z }, scale, material);

      entity.enabled = false;
      enemies.push({
        encounterId: encounter.id,
        enemyId: spawn.enemyId,
        definition,
        entity,
        health: definition.maxHp,
        active: false,
        dead: false,
        cooldown: Math.random() * 1.2
      });
    }
  }
}

export function updateEncounterState(state, playerPos) {
  const currentRoom = getCurrentRoom(playerPos);

  for (const encounter of LEVEL_1_ENCOUNTERS) {
    if (state.encounterTriggered.has(encounter.id)) {
      continue;
    }

    if (ENCOUNTER_TRIGGER_ROOMS[encounter.id] === currentRoom) {
      state.encounterTriggered.add(encounter.id);
      state.rageActive = true;
      state.message = `Encounter: ${encounter.areaId}`;

      for (const enemy of enemies) {
        if (enemy.encounterId === encounter.id) {
          enemy.active = true;
          enemy.entity.enabled = true;
        }
      }
    }
  }

  for (const encounter of LEVEL_1_ENCOUNTERS) {
    if (!state.encounterTriggered.has(encounter.id) || state.encounterCleared.has(encounter.id)) {
      continue;
    }

    const aliveEnemies = enemies.some((enemy) => enemy.encounterId === encounter.id && !enemy.dead);
    if (!aliveEnemies) {
      state.encounterCleared.add(encounter.id);
      state.message = `Cleared ${encounter.areaId}.`;
    }
  }
}

export function updateEnemies(dt, state, playerPos, handleDeath) {
  for (const enemy of enemies) {
    if (!enemy.active || enemy.dead) {
      continue;
    }

    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    const enemyPos = enemy.entity.getPosition();
    const toPlayer = playerPos.clone().sub(enemyPos);
    const distance = toPlayer.length();
    const direction = toPlayer.normalize();

    const speed = enemy.definition.moveSpeed * (enemy.enemyId === "giantCentipede" ? 2.0 : 1.8);
    const wantsRange = enemy.enemyId === "kobold" ? 4.5 : 1.3;

    if (distance > wantsRange) {
      const nextPosition = enemyPos.clone().add(direction.scale(speed * dt));
      nextPosition.y = enemyPos.y;
      if (isInsideWalkableArea(nextPosition) && !intersectsCollider(nextPosition, 0.4)) {
        enemy.entity.setPosition(nextPosition);
      }
    }

    enemy.entity.lookAt(playerPos.x, enemyPos.y, playerPos.z);

    if (enemy.cooldown > 0) {
      continue;
    }

    if (enemy.enemyId === "kobold" && distance > 2.2 && distance < 8) {
      spawnEnemyProjectile(state, enemy, direction);
      enemy.cooldown = 2.4;
      continue;
    }

    if (distance <= enemy.definition.attackRange + 0.6) {
      const attack = resolveAttack({
        attackBonus: enemy.definition.attackBonus,
        armorClass: 14,
        damageExpression: enemy.definition.damageExpression
      });

      enemy.cooldown = enemy.enemyId === "kobold" ? 1.6 : 1.2;

      if (attack.hit) {
        const incoming = applyDamageMitigation(attack.damage, {
          rageActive: state.rageActive,
          damageType: enemy.definition.damageType
        });
        state.health = Math.max(0, state.health - incoming);
        AudioManager.playPlayerHurt();
        VfxManager.spawnBloodBurst(playerPos);
        state.message = attack.crit
          ? `${enemy.definition.displayName} crits for ${incoming}.`
          : `${enemy.definition.displayName} hits for ${incoming}.`;
        if (state.health <= 0) {
          handleDeath();
          return;
        }
      } else {
        state.message = `${enemy.definition.displayName} misses.`;
      }
    }
  }
}

export function spawnEnemyProjectile(state, enemy, direction) {
  const projectile = createSphere(enemy.entity.parent, "stone", enemy.entity.getPosition(), { x: 0.18, y: 0.18, z: 0.18 }, materials.accent);
  projectile.setPosition(enemy.entity.getPosition().x, 0.5, enemy.entity.getPosition().z);
  state.projectiles.push({
    entity: projectile,
    direction: new pc.Vec3(direction.x, 0, direction.z).normalize(),
    speed: 9,
    lifetime: 2.5,
    damageExpression: "1d4+2",
    fromEnemy: true
  });
}
