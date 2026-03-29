const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildEncounterSummary,
  getEncounterXpTotal,
  getLevelXpTotal
} = require("../src/world/encounters");
const { LEVEL_1_ENCOUNTERS } = require("../src/config/level1-data");

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
