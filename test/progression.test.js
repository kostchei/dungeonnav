import test from "node:test";
import assert from "node:assert/strict";

import progressionModule from "../src/player/progression.js";
const {
  addXp,
  createPlayerProgressionState
} = progressionModule;

test("progression starts at level 1 with base combat stats", () => {
  const state = createPlayerProgressionState();
  assert.equal(state.level, 1);
  assert.equal(state.maxHp, 18);
  assert.equal(state.meleeBonus, 0);
  assert.equal(state.recoveryBonus, 0);
});

test("xp accumulates without mutating base stats", () => {
  const progressed = addXp(createPlayerProgressionState(), 300);
  assert.equal(progressed.xp, 300);
  assert.equal(progressed.level, 1);
  assert.equal(progressed.maxHp, 18);
});
