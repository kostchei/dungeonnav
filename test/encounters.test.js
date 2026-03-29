import test from "node:test";
import assert from "node:assert/strict";

import encountersModule from "../src/world/encounters.js";
const {
  buildEncounterSummary,
  getEncounterXpTotal,
  getLevelXpTotal
} = encountersModule;
import configModule from "../src/config/level1-data.js";
const { LEVEL_1_ENCOUNTERS } = configModule;

test("individual encounter xp totals are computed from enemy definitions", () => {
  const westRoom = LEVEL_1_ENCOUNTERS.find((encounter) => encounter.id === "a3-west-room");
  assert.equal(getEncounterXpTotal(westRoom), 100);
});

test("level 1 xp total is 300", () => {
  assert.equal(getLevelXpTotal(), 300);
});

test("encounter summary returns compact authored output", () => {
  const summary = buildEncounterSummary();
  assert.equal(summary.length, 5);
  assert.deepEqual(summary[0], {
    id: "a1-scout",
    areaId: "A1",
    enemyCount: 1,
    xpTotal: 25
  });
});
