import * as pc from "playcanvas";
import "./styles.css";

import configModule from "../config/level1-data.js";
import progressionModule from "../player/progression.js";
import resolverModule from "../combat/resolver.js";
import encountersModule from "../world/encounters.js";
import recklessModule from "../player/reckless-attack.js";
import {
  ENCOUNTER_LAYOUT,
  ENCOUNTER_TRIGGER_ROOMS,
  PLAYER_START,
  ROOM_RECTS,
  TREASURE_POSITION,
  WALL_SEGMENTS
} from "./layout.js";

const { ENEMY_DEFS, LEVEL_1_ENCOUNTERS, LEVEL_2_XP_THRESHOLD } = configModule;
const { addXp, applyPendingLevelTransition, createPlayerProgressionState, getPendingLevelTransition } = progressionModule;
const { applyDamageMitigation, resolveAttack } = resolverModule;
const { getLevelXpTotal } = encountersModule;
const { createRecklessAttackState, syncRecklessAttackAvailability, toggleRecklessAttack } = recklessModule;

const canvas = document.getElementById("application");
const overlay = document.getElementById("overlay");
const healthEl = document.getElementById("health");
const rageEl = document.getElementById("rage");
const xpEl = document.getElementById("xp");
const ammoEl = document.getElementById("ammo");
const objectiveEl = document.getElementById("objective");
const levelStateEl = document.getElementById("level-state");
const recklessStateEl = document.getElementById("reckless-state");
const messageEl = document.getElementById("message");

const app = new pc.Application(canvas, {
  mouse: new pc.Mouse(document.body),
  keyboard: new pc.Keyboard(window)
});

app.start();
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);
window.addEventListener("resize", () => app.resizeCanvas(canvas.width, canvas.height));
app.scene.ambientLight = new pc.Color(0.14, 0.11, 0.09);
app.scene.gammaCorrection = pc.GAMMA_SRGB;
app.scene.toneMapping = pc.TONEMAP_ACES;

const materials = {
  floor: createStandardMaterial("#3a2f24"),
  wall: createStandardMaterial("#5d4734"),
  corridor: createStandardMaterial("#4c3b2d"),
  kobold: createStandardMaterial("#7d8c5d"),
  centipede: createStandardMaterial("#95614e"),
  playerProjectile: createStandardMaterial("#d4b16a"),
  treasure: createStandardMaterial("#d4aa52"),
  torch: createStandardMaterial("#ffca76"),
  accent: createStandardMaterial("#8a1f12")
};

const worldRoot = new pc.Entity("world");
app.root.addChild(worldRoot);

const playerRig = new pc.Entity("playerRig");
playerRig.setPosition(PLAYER_START.x, PLAYER_START.y, PLAYER_START.z);
app.root.addChild(playerRig);

const cameraPitch = new pc.Entity("cameraPitch");
playerRig.addChild(cameraPitch);

const camera = new pc.Entity("camera");
camera.addComponent("camera", {
  clearColor: new pc.Color(0.07, 0.06, 0.05),
  farClip: 100
});
cameraPitch.addChild(camera);

let yaw = 0;
let pitch = 0;

const state = {
  health: 18,
  maxHp: 18,
  ammo: 4,
  rageActive: false,
  dead: false,
  won: false,
  treasureCollected: false,
  objective: "Enter the kobold cave.",
  progression: createPlayerProgressionState(),
  reckless: createRecklessAttackState(),
  message: "Click to begin.",
  meleeCooldown: 0,
  throwCooldown: 0,
  encounterTriggered: new Set(),
  encounterCleared: new Set(),
  totalLevelXp: getLevelXpTotal(),
  level2Ready: false,
  projectiles: []
};

const colliders = [];
const enemies = [];
let treasure = null;

buildLevelGeometry();
buildLights();
spawnEncounters();
spawnTreasure();
syncUi();

document.body.addEventListener("click", () => {
  if (document.pointerLockElement !== canvas) {
    canvas.requestPointerLock();
  }
  overlay.classList.add("hidden");
});

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement !== canvas && !state.dead && !state.won) {
    overlay.classList.remove("hidden");
  }
});

app.mouse.on("mousemove", (event) => {
  if (document.pointerLockElement !== canvas || state.dead || state.won) {
    return;
  }

  yaw -= event.dx * 0.12;
  pitch = pc.math.clamp(pitch - event.dy * 0.12, -65, 65);
});

app.mouse.on("mousedown", (event) => {
  if (document.pointerLockElement !== canvas || state.dead || state.won) {
    return;
  }

  if (event.button === 0) {
    tryPlayerMeleeAttack();
  } else if (event.button === 2) {
    event.event.preventDefault();
    tryPlayerThrow();
  }
});

window.addEventListener("contextmenu", (event) => event.preventDefault());

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyE") {
    tryInteract();
  } else if (event.code === "KeyR") {
    state.rageActive = !state.rageActive;
    state.message = state.rageActive ? "Rage kindles." : "Rage eases.";
  } else if (event.code === "KeyQ") {
    const nextState = toggleRecklessAttack(state.reckless);
    if (nextState !== state.reckless) {
      state.reckless = nextState;
      state.message = nextState.active ? "Reckless Attack primed." : "Reckless Attack lowered.";
    } else {
      state.message = "Reckless Attack is still locked.";
    }
  } else if (event.code === "Enter" && (state.dead || state.won)) {
    window.location.reload();
  }

  syncUi();
});

app.on("update", (dt) => {
  if (state.dead || state.won) {
    syncUi();
    return;
  }

  state.meleeCooldown = Math.max(0, state.meleeCooldown - dt);
  state.throwCooldown = Math.max(0, state.throwCooldown - dt);

  updateCameraTransform();
  updatePlayerMovement(dt);
  updateEncounterState();
  updateEnemies(dt);
  updateProjectiles(dt);
  updateTreasure();
  updateObjective();
  syncUi();
});

function createStandardMaterial(hexColor) {
  const material = new pc.StandardMaterial();
  const color = new pc.Color();
  color.fromString(hexColor);
  material.diffuse = color;
  material.metalness = 0.05;
  material.gloss = 0.25;
  material.update();
  return material;
}

function createBox(name, position, scale, material) {
  const entity = new pc.Entity(name);
  entity.addComponent("render", { type: "box", material });
  entity.setPosition(position.x, position.y, position.z);
  entity.setLocalScale(scale.x, scale.y, scale.z);
  worldRoot.addChild(entity);
  return entity;
}

function createSphere(name, position, scale, material) {
  const entity = new pc.Entity(name);
  entity.addComponent("render", { type: "sphere", material });
  entity.setPosition(position.x, position.y, position.z);
  entity.setLocalScale(scale.x, scale.y, scale.z);
  worldRoot.addChild(entity);
  return entity;
}

function buildRectFloor(rect, y, material) {
  const centerX = (rect.minX + rect.maxX) / 2;
  const centerZ = (rect.minZ + rect.maxZ) / 2;
  const width = rect.maxX - rect.minX;
  const depth = rect.maxZ - rect.minZ;
  createBox("floor", { x: centerX, y, z: centerZ }, { x: width, y: 0.2, z: depth }, material);
}

function buildLevelGeometry() {
  buildRectFloor(ROOM_RECTS.exterior, -0.1, materials.floor);
  buildRectFloor(ROOM_RECTS.A1, -0.1, materials.corridor);
  buildRectFloor(ROOM_RECTS.A2, -0.1, materials.corridor);
  buildRectFloor(ROOM_RECTS.A3, -0.1, materials.floor);
  buildRectFloor(ROOM_RECTS.A5, -0.1, materials.floor);
  buildRectFloor(ROOM_RECTS.A4, -0.1, materials.floor);

  for (const wall of WALL_SEGMENTS) {
    createBox(
      "wall",
      { x: wall.x, y: wall.h / 2, z: wall.z },
      { x: wall.hx * 2, y: wall.h, z: wall.hz * 2 },
      materials.wall
    );

    colliders.push({
      minX: wall.x - wall.hx,
      maxX: wall.x + wall.hx,
      minZ: wall.z - wall.hz,
      maxZ: wall.z + wall.hz
    });
  }

  createBox("altar", { x: 0, y: 0.4, z: 18.5 }, { x: 1.4, y: 0.8, z: 1.4 }, materials.accent);
}

function buildLights() {
  const sun = new pc.Entity("sun");
  sun.addComponent("light", {
    type: "directional",
    intensity: 1.2,
    color: new pc.Color(1, 0.92, 0.82),
    castShadows: false
  });
  sun.setEulerAngles(45, 30, 0);
  app.root.addChild(sun);

  const torchPositions = [
    { x: -1.4, y: 1.9, z: 0.4 },
    { x: -1.4, y: 1.9, z: 8 },
    { x: -8, y: 1.9, z: 11 },
    { x: 8, y: 1.9, z: 11 },
    { x: 0, y: 1.9, z: 17.75 }
  ];

  for (const position of torchPositions) {
    createSphere("torch", position, { x: 0.2, y: 0.2, z: 0.2 }, materials.torch);
    const light = new pc.Entity("torchLight");
    light.addComponent("light", {
      type: "omni",
      color: new pc.Color(1, 0.62, 0.32),
      intensity: 1.6,
      range: 9
    });
    light.setPosition(position.x, position.y, position.z);
    worldRoot.addChild(light);
  }
}

function spawnEncounters() {
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
        ? createBox(definition.displayName, { x: spawn.x, y, z: spawn.z }, scale, material)
        : createSphere(definition.displayName, { x: spawn.x, y, z: spawn.z }, scale, material);

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

function spawnTreasure() {
  treasure = createBox("treasure", TREASURE_POSITION, { x: 0.8, y: 0.5, z: 0.8 }, materials.treasure);
  treasure.enabled = false;
}

function updateCameraTransform() {
  playerRig.setEulerAngles(0, yaw, 0);
  cameraPitch.setEulerAngles(pitch, 0, 0);
}

function getForward() {
  return camera.forward.clone().normalize();
}

function getCurrentRoom(position) {
  for (const [name, rect] of Object.entries(ROOM_RECTS)) {
    if (position.x >= rect.minX && position.x <= rect.maxX && position.z >= rect.minZ && position.z <= rect.maxZ) {
      return name;
    }
  }

  return "void";
}

function isInsideWalkableArea(position) {
  return Object.values(ROOM_RECTS).some((rect) => (
    position.x >= rect.minX + 0.45 &&
    position.x <= rect.maxX - 0.45 &&
    position.z >= rect.minZ + 0.45 &&
    position.z <= rect.maxZ - 0.45
  ));
}

function intersectsCollider(position, radius = 0.35) {
  return colliders.some((collider) => (
    position.x + radius > collider.minX &&
    position.x - radius < collider.maxX &&
    position.z + radius > collider.minZ &&
    position.z - radius < collider.maxZ
  ));
}

function updatePlayerMovement(dt) {
  const move = new pc.Vec3();
  const forward = getForward();
  forward.y = 0;
  forward.normalize();
  const right = new pc.Vec3();
  right.cross(forward, pc.Vec3.UP).normalize();

  if (app.keyboard.isPressed(pc.KEY_W)) move.add(forward);
  if (app.keyboard.isPressed(pc.KEY_S)) move.sub(forward);
  if (app.keyboard.isPressed(pc.KEY_D)) move.add(right);
  if (app.keyboard.isPressed(pc.KEY_A)) move.sub(right);

  if (move.lengthSq() === 0) {
    return;
  }

  move.normalize();
  const speed = app.keyboard.isPressed(pc.KEY_SHIFT) ? 5.5 : 3.6;
  move.scale(speed * dt);

  const candidate = playerRig.getPosition().clone().add(move);
  candidate.y = PLAYER_START.y;

  if (isInsideWalkableArea(candidate) && !intersectsCollider(candidate)) {
    playerRig.setPosition(candidate);
    return;
  }

  const xOnly = playerRig.getPosition().clone();
  xOnly.x += move.x;
  if (isInsideWalkableArea(xOnly) && !intersectsCollider(xOnly)) {
    playerRig.setPosition(xOnly);
  }

  const zOnly = playerRig.getPosition().clone();
  zOnly.z += move.z;
  if (isInsideWalkableArea(zOnly) && !intersectsCollider(zOnly)) {
    playerRig.setPosition(zOnly);
  }
}

function updateEncounterState() {
  const currentRoom = getCurrentRoom(playerRig.getPosition());

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

function updateEnemies(dt) {
  const playerPos = playerRig.getPosition();

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
      spawnEnemyProjectile(enemy, direction);
      enemy.cooldown = 2.4;
      continue;
    }

    if (distance <= enemy.definition.attackRange + 0.6) {
      const attack = resolveAttack({
        attackBonus: enemy.definition.attackBonus,
        armorClass: 14 + (state.reckless.active ? -2 : 0),
        damageExpression: enemy.definition.damageExpression
      });

      enemy.cooldown = enemy.enemyId === "kobold" ? 1.6 : 1.2;

      if (attack.hit) {
        const incoming = applyDamageMitigation(attack.damage, {
          rageActive: state.rageActive,
          damageType: enemy.definition.damageType
        });
        state.health = Math.max(0, state.health - incoming);
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

function spawnEnemyProjectile(enemy, direction) {
  const projectile = createSphere("stone", enemy.entity.getPosition(), { x: 0.18, y: 0.18, z: 0.18 }, materials.accent);
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

function tryPlayerMeleeAttack() {
  if (state.meleeCooldown > 0) {
    return;
  }

  state.meleeCooldown = 0.55;
  const playerPos = playerRig.getPosition();
  const forward = getForward();
  let bestTarget = null;
  let bestDistance = Infinity;

  for (const enemy of enemies) {
    if (enemy.dead || !enemy.active) {
      continue;
    }

    const toEnemy = enemy.entity.getPosition().clone().sub(playerPos);
    const distance = toEnemy.length();
    if (distance > 2.25) {
      continue;
    }

    toEnemy.normalize();
    if (forward.dot(toEnemy) < 0.4) {
      continue;
    }

    if (distance < bestDistance) {
      bestDistance = distance;
      bestTarget = enemy;
    }
  }

  if (!bestTarget) {
    state.message = "Miss!";
    return;
  }

  const attack = resolveAttack({
    attackBonus: 7,
    armorClass: bestTarget.definition.armorClass,
    damageExpression: "1d12+5",
    rageActive: state.rageActive,
    meleeBonus: state.progression.meleeBonus,
    recklessAttack: state.reckless.active
  });

  if (!attack.hit) {
    state.message = "Miss!";
    return;
  }

  applyDamageToEnemy(bestTarget, attack.damage, attack.crit);
}

function tryPlayerThrow() {
  if (state.throwCooldown > 0 || state.ammo <= 0) {
    if (state.ammo <= 0) {
      state.message = "No throwing axes left.";
    }
    return;
  }

  state.throwCooldown = 0.85;
  state.ammo -= 1;

  const forward = getForward();
  const projectile = createSphere("axe", playerRig.getPosition(), { x: 0.22, y: 0.22, z: 0.22 }, materials.playerProjectile);
  projectile.setPosition(playerRig.getPosition().x, 1.25, playerRig.getPosition().z);
  state.projectiles.push({
    entity: projectile,
    direction: new pc.Vec3(forward.x, 0, forward.z).normalize(),
    speed: 15,
    lifetime: 1.8,
    damageExpression: "1d6+3",
    fromEnemy: false
  });
}

function updateProjectiles(dt) {
  const playerPos = playerRig.getPosition();
  state.projectiles = state.projectiles.filter((projectile) => {
    projectile.lifetime -= dt;
    if (projectile.lifetime <= 0) {
      projectile.entity.destroy();
      return false;
    }

    const current = projectile.entity.getPosition();
    const next = current.clone().add(projectile.direction.clone().scale(projectile.speed * dt));
    projectile.entity.setPosition(next);

    if (!isInsideWalkableArea(next) || intersectsCollider(next, 0.2)) {
      projectile.entity.destroy();
      return false;
    }

    if (projectile.fromEnemy) {
      if (next.distance(playerPos) <= 0.7) {
        const impact = resolveAttack({
          attackBonus: 4,
          armorClass: 14 + (state.reckless.active ? -2 : 0),
          damageExpression: projectile.damageExpression
        });

        if (impact.hit) {
          const incoming = applyDamageMitigation(impact.damage, {
            rageActive: state.rageActive,
            damageType: "piercing"
          });
          state.health = Math.max(0, state.health - incoming);
          state.message = `A stone strikes for ${incoming}.`;
          if (state.health <= 0) {
            handleDeath();
          }
        } else {
          state.message = "A sling stone skims past.";
        }

        projectile.entity.destroy();
        return false;
      }
    } else {
      for (const enemy of enemies) {
        if (enemy.dead || !enemy.active) {
          continue;
        }

        if (next.distance(enemy.entity.getPosition()) <= 0.85) {
          const attack = resolveAttack({
            attackBonus: 6,
            armorClass: enemy.definition.armorClass,
            damageExpression: projectile.damageExpression
          });

          if (attack.hit) {
            applyDamageToEnemy(enemy, attack.damage, attack.crit);
          } else {
            state.message = "Thrown axe misses.";
          }

          projectile.entity.destroy();
          return false;
        }
      }
    }

    return true;
  });
}

function applyDamageToEnemy(enemy, damage, crit) {
  enemy.health -= damage;
  if (enemy.health <= 0) {
    enemy.dead = true;
    enemy.entity.destroy();
    const nextProgression = addXp(state.progression, enemy.definition.xpValue);
    state.progression = nextProgression;
    const pending = getPendingLevelTransition(state.progression);
    state.level2Ready = Boolean(pending);
    state.reckless = syncRecklessAttackAvailability(
      state.reckless,
      pending ? applyPendingLevelTransition(state.progression) : state.progression
    );
    state.message = crit
      ? `Critical Hit! ${enemy.definition.displayName} falls.`
      : `${enemy.definition.displayName} dies.`;
    return;
  }

  state.message = crit
    ? `Critical Hit! ${damage} dealt.`
    : `${damage} dealt to ${enemy.definition.displayName}.`;
}

function updateTreasure() {
  treasure.enabled = state.encounterCleared.has("a4-main-lair") && !state.treasureCollected;
}

function tryInteract() {
  if (state.dead || state.won) {
    return;
  }

  if (treasure.enabled && treasure.getPosition().distance(playerRig.getPosition()) <= 2.2) {
    state.treasureCollected = true;
    treasure.enabled = false;
    state.message = state.level2Ready
      ? "Treasure claimed. Level 2 is ready for the next slice."
      : "Treasure claimed.";
    handleVictory();
    return;
  }

  state.message = "Nothing to use here.";
}

function updateObjective() {
  if (state.won) {
    state.objective = "Level complete.";
  } else if (state.treasureCollected) {
    state.objective = "Level complete.";
  } else if (state.encounterTriggered.size === 0) {
    state.objective = "Enter the kobold cave.";
  } else if (!state.encounterCleared.has("a4-main-lair")) {
    state.objective = "Clear the lair and claim its treasure.";
  } else {
    state.objective = "Press E to claim the treasure.";
  }
}

function handleDeath() {
  state.dead = true;
  state.health = 0;
  state.message = "Thrud falls. Press Enter to restart.";
  overlay.classList.remove("hidden");
  overlay.querySelector(".panel").innerHTML = `
    <h1>Thrud Falls</h1>
    <p>The kobolds keep the cave.</p>
    <p>Press <strong>Enter</strong> to restart.</p>
  `;
}

function handleVictory() {
  state.won = true;
  overlay.classList.remove("hidden");
  overlay.querySelector(".panel").innerHTML = `
    <h1>Level Cleared</h1>
    <p>Treasure taken from Cave A.</p>
    <p>XP ${state.progression.xp} / ${LEVEL_2_XP_THRESHOLD}</p>
    <p>${state.level2Ready ? "Level 2 transition is ready for the next slice." : "More progression work remains."}</p>
    <p>Press <strong>Enter</strong> to replay.</p>
  `;
}

function syncUi() {
  healthEl.textContent = `HP ${state.health} / ${state.maxHp}`;
  rageEl.textContent = state.rageActive ? "Rage Active" : "Rage Dormant";
  xpEl.textContent = `XP ${state.progression.xp} / ${LEVEL_2_XP_THRESHOLD}`;
  ammoEl.textContent = `Axes ${state.ammo}`;
  objectiveEl.textContent = state.objective;
  levelStateEl.textContent = state.level2Ready ? "Level 1, Level 2 Ready" : "Level 1";
  recklessStateEl.textContent = state.reckless.available
    ? `Q Reckless: ${state.reckless.active ? "Active" : "Ready"}`
    : "Q Reckless: Locked";
  messageEl.textContent = state.message;
  state.maxHp = state.progression.maxHp;
}
