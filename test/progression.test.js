const test = require("node:test");
const assert = require("node:assert/strict");

const {
  addXp,
  applyPendingLevelTransition,
  createPlayerProgressionState,
  getPendingLevelTransition
} = require("../src/player/progression");
const {
  createRecklessAttackState,
  syncRecklessAttackAvailability,
  toggleRecklessAttack
} = require("../src/player/reckless-attack");

test("progression starts at level 1 with no reckless attack unlocked", () => {
  const state = createPlayerProgressionState();
  assert.equal(state.level, 1);
  assert.equal(state.maxHp, 18);
  assert.equal(state.unlockFlags.recklessAttack, false);
});

test("xp transition becomes pending at 300 xp", () => {
  const progressed = addXp(createPlayerProgressionState(), 300);
  const pending = getPendingLevelTransition(progressed);

  assert.deepEqual(pending.fromLevel, 1);
  assert.deepEqual(pending.toLevel, 2);
  assert.equal(pending.nextStats.maxHp, 31);
});

test("applying level transition updates stats and unlocks reckless attack", () => {
  const progressed = addXp(createPlayerProgressionState(), 300);
  const leveled = applyPendingLevelTransition(progressed);

  assert.equal(leveled.level, 2);
  assert.equal(leveled.maxHp, 31);
  assert.equal(leveled.unlockFlags.recklessAttack, true);
});

test("reckless attack stays unavailable until unlocked", () => {
  const reckless = createRecklessAttackState();
  const toggled = toggleRecklessAttack(reckless);

  assert.equal(toggled.active, false);
  assert.equal(toggled.selfVulnerability, false);
});

test("reckless attack can be toggled after progression unlock", () => {
  const leveled = applyPendingLevelTransition(addXp(createPlayerProgressionState(), 300));
  const synced = syncRecklessAttackAvailability(createRecklessAttackState(), leveled);
  const toggled = toggleRecklessAttack(synced);

  assert.equal(toggled.available, true);
  assert.equal(toggled.active, true);
  assert.equal(toggled.selfVulnerability, true);
});
