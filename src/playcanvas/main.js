import * as pc from "playcanvas";
import "./styles.css";

import progressionModule from "../player/progression.js";
import resolverModule from "../combat/resolver.js";
import encountersModule from "../world/encounters.js";
import { AudioManager } from "./audio-manager.js";
import { VfxManager } from "./vfx-manager.js";
import { PLAYER_START, TREASURE_POSITION } from "./layout.js";
import { buildLevelGeometry, buildLights, createBox, createSphere, materials, isInsideWalkableArea, intersectsCollider } from "./scene-builder.js";
import { getForward, updateCameraTransform, updatePlayerMovement } from "./camera-controller.js";
import { enemies, spawnEncounters, updateEnemies, updateEncounterState } from "./ai-controller.js";

const { addXp, createPlayerProgressionState } = progressionModule;
const { applyDamageMitigation, resolveAttack } = resolverModule;
const { getLevelXpTotal } = encountersModule;

const canvas = document.getElementById("application");
const overlay = document.getElementById("overlay");
const healthEl = document.getElementById("health");
const rageEl = document.getElementById("rage");
const xpEl = document.getElementById("xp");
const ammoEl = document.getElementById("ammo");
const objectiveEl = document.getElementById("objective");
const levelStateEl = document.getElementById("level-state");
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
  objective: "Push deeper into the cave.",
  progression: createPlayerProgressionState(),
  message: "Click to begin.",
  meleeCooldown: 0,
  throwCooldown: 0,
  encounterTriggered: new Set(),
  encounterCleared: new Set(),
  totalLevelXp: getLevelXpTotal(),
  projectiles: []
};

let treasure = null;

buildLevelGeometry(worldRoot);
buildLights(app, worldRoot);
VfxManager.init(app, worldRoot);
spawnEncounters(worldRoot);
spawnTreasure();
syncUi();

document.body.addEventListener("click", () => {
  AudioManager.initAmbient();
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

  updateCameraTransform(playerRig, cameraPitch, yaw, pitch);
  updatePlayerMovement(app, playerRig, camera, dt);
  updateEncounterState(state, playerRig.getPosition());
  updateEnemies(dt, state, playerRig.getPosition(), handleDeath);
  updateProjectiles(dt);
  updateTreasure();
  updateObjective();
  syncUi();
});

function spawnTreasure() {
  treasure = createBox(worldRoot, "treasure", TREASURE_POSITION, { x: 0.8, y: 0.5, z: 0.8 }, materials.treasure);
  treasure.enabled = false;
}

function tryPlayerMeleeAttack() {
  if (state.meleeCooldown > 0) return;
  state.meleeCooldown = 0.55;
  const playerPos = playerRig.getPosition();
  const forward = getForward(camera);
  let bestTarget = null;
  let bestDistance = Infinity;

  for (const enemy of enemies) {
    if (enemy.dead || !enemy.active) continue;
    const toEnemy = enemy.entity.getPosition().clone().sub(playerPos);
    const distance = toEnemy.length();
    if (distance > 2.25) continue;
    toEnemy.normalize();
    if (forward.dot(toEnemy) < 0.4) continue;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestTarget = enemy;
    }
  }

  if (!bestTarget) {
    AudioManager.playAxeSwing();
    state.message = "Miss!";
    return;
  }

  const attack = resolveAttack({
    attackBonus: 7,
    armorClass: bestTarget.definition.armorClass,
    damageExpression: "1d12+5",
    rageActive: state.rageActive,
    meleeBonus: state.progression.meleeBonus
  });

  if (!attack.hit) {
    AudioManager.playAxeSwing();
    state.message = "Miss!";
    return;
  }

  AudioManager.playAxeSwing();
  AudioManager.playAxeHit();
  VfxManager.spawnBloodBurst(bestTarget.entity.getPosition());
  applyDamageToEnemy(bestTarget, attack.damage, attack.crit);
}

function tryPlayerThrow() {
  if (state.throwCooldown > 0 || state.ammo <= 0) {
    if (state.ammo <= 0) state.message = "No throwing axes left.";
    return;
  }
  state.throwCooldown = 0.85;
  state.ammo -= 1;
  const forward = getForward(camera);
  AudioManager.playAxeSwing();
  const projectile = createSphere(worldRoot, "axe", playerRig.getPosition(), { x: 0.22, y: 0.22, z: 0.22 }, materials.playerProjectile);
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
          armorClass: 14,
          damageExpression: projectile.damageExpression
        });
        if (impact.hit) {
          const incoming = applyDamageMitigation(impact.damage, {
            rageActive: state.rageActive,
            damageType: "piercing"
          });
          state.health = Math.max(0, state.health - incoming);
          AudioManager.playPlayerHurt();
          VfxManager.spawnBloodBurst(playerPos);
          state.message = `A stone strikes for ${incoming}.`;
          if (state.health <= 0) handleDeath();
        } else {
          state.message = "A sling stone skims past.";
        }
        projectile.entity.destroy();
        return false;
      }
    } else {
      for (const enemy of enemies) {
        if (enemy.dead || !enemy.active) continue;
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
    AudioManager.playKoboldDeath();
    enemy.dead = true;
    enemy.entity.destroy();
    state.progression = addXp(state.progression, enemy.definition.xpValue);
    state.message = crit ? `Critical Hit! ${enemy.definition.displayName} falls.` : `${enemy.definition.displayName} dies.`;
    return;
  }
  AudioManager.playKoboldHurt();
  state.message = crit ? `Critical Hit! ${damage} dealt.` : `${damage} dealt to ${enemy.definition.displayName}.`;
}

function updateTreasure() {
  treasure.enabled = state.encounterCleared.has("a4-main-lair") && !state.treasureCollected;
}

function tryInteract() {
  if (state.dead || state.won) return;
  if (treasure.enabled && treasure.getPosition().distance(playerRig.getPosition()) <= 2.2) {
    AudioManager.playPickup();
    state.treasureCollected = true;
    treasure.enabled = false;
    state.message = "Treasure claimed.";
    handleVictory();
    return;
  }
  state.message = "Nothing to use here.";
}

function updateObjective() {
  if (state.won || state.treasureCollected) {
    state.objective = "Level complete.";
  } else if (state.encounterTriggered.size === 0) {
    state.objective = "Push deeper into the cave.";
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
    <p>XP ${state.progression.xp} / ${state.totalLevelXp}</p>
    <p>Press <strong>Enter</strong> to replay.</p>
  `;
}

function syncUi() {
  healthEl.textContent = `HP ${state.health} / ${state.maxHp}`;
  rageEl.textContent = state.rageActive ? "Rage Active" : "Rage Dormant";
  xpEl.textContent = `XP ${state.progression.xp} / ${state.totalLevelXp}`;
  ammoEl.textContent = `Axes ${state.ammo}`;
  objectiveEl.textContent = state.objective;
  levelStateEl.textContent = "Level 1";
  messageEl.textContent = state.message;
  state.maxHp = state.progression.maxHp;
}
