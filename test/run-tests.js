import assert from "node:assert/strict";

import resolverModule from "../src/combat/resolver.js";
const {
  applyDamageMitigation,
  resolveAttack,
  rollAttackD20
} = resolverModule;
import {  parseDamageExpression, rollDamage  } from "../src/combat/dice.js";
import progressionModule from "../src/player/progression.js";
const {
  addXp,
  createPlayerProgressionState
} = progressionModule;
import encountersModule from "../src/world/encounters.js";
const {
  buildEncounterSummary,
  getEncounterXpTotal,
  getLevelXpTotal
} = encountersModule;
import configModule from "../src/config/level1-data.js";
const { LEVEL_1_ENCOUNTERS } = configModule;

function createSequenceRng(values) {
  let index = 0;
  return () => {
    const value = values[index];
    index += 1;
    return value;
  };
}

const tests = [
  {
    name: "parseDamageExpression parses standard dice notation",
    fn: () => {
      assert.deepEqual(parseDamageExpression("1d12+5"), {
        diceCount: 1,
        diceSides: 12,
        modifier: 5
      });
    }
  },
  {
    name: "rollDamage uses supplied rng deterministically",
    fn: () => {
      const result = rollDamage("2d4+1", createSequenceRng([0.0, 0.5]));
      assert.equal(result.total, 5);
    }
  },
  {
    name: "rollAttackD20 uses supplied rng deterministically",
    fn: () => {
      const result = rollAttackD20(createSequenceRng([0.1]));
      assert.equal(result.roll, 3);
      assert.equal(result.hasAdvantage, false);
    }
  },
  {
    name: "resolveAttack returns miss when total attack is below AC",
    fn: () => {
      const result = resolveAttack({
        attackBonus: 4,
        armorClass: 20,
        damageExpression: "1d12+5"
      }, createSequenceRng([0.1]));

      assert.equal(result.hit, false);
      assert.equal(result.crit, false);
    }
  },
  {
    name: "resolveAttack applies rage and melee bonuses on hit",
    fn: () => {
      const result = resolveAttack({
        attackBonus: 5,
        armorClass: 10,
        damageExpression: "1d12+5",
        rageActive: true,
        meleeBonus: 1
      }, createSequenceRng([0.7, 0.0]));

      assert.equal(result.hit, true);
      assert.equal(result.crit, false);
      assert.equal(result.damage, 9);
    }
  },
  {
    name: "resolveAttack applies crit bonus damage on natural 20",
    fn: () => {
      const result = resolveAttack({
        attackBonus: 5,
        armorClass: 50,
        damageExpression: "1d4+2"
      }, createSequenceRng([0.99, 0.0, 0.5]));

      assert.equal(result.hit, true);
      assert.equal(result.crit, true);
      assert.equal(result.damage, 6);
    }
  },
  {
    name: "applyDamageMitigation halves physical damage during rage",
    fn: () => {
      assert.equal(applyDamageMitigation(9, { rageActive: true, damageType: "slashing" }), 4);
      assert.equal(applyDamageMitigation(9, { rageActive: true, damageType: "fire" }), 9);
    }
  },
  {
    name: "progression starts at level 1 with base combat stats",
    fn: () => {
      const state = createPlayerProgressionState();
      assert.equal(state.level, 1);
      assert.equal(state.maxHp, 18);
      assert.equal(state.meleeBonus, 0);
      assert.equal(state.recoveryBonus, 0);
    }
  },
  {
    name: "xp accumulates without mutating base stats",
    fn: () => {
      const progressed = addXp(createPlayerProgressionState(), 300);
      assert.equal(progressed.xp, 300);
      assert.equal(progressed.level, 1);
      assert.equal(progressed.maxHp, 18);
    }
  },
  {
    name: "individual encounter xp totals are computed from enemy definitions",
    fn: () => {
      const westRoom = LEVEL_1_ENCOUNTERS.find((encounter) => encounter.id === "a3-west-room");
      assert.equal(getEncounterXpTotal(westRoom), 100);
    }
  },
  {
    name: "level 1 xp total is 300",
    fn: () => {
      assert.equal(getLevelXpTotal(), 300);
    }
  },
  {
    name: "encounter summary returns compact authored output",
    fn: () => {
      const summary = buildEncounterSummary();
      assert.equal(summary.length, 5);
      assert.deepEqual(summary[0], {
        id: "a1-scout",
        areaId: "A1",
        enemyCount: 1,
        xpTotal: 25
      });
    }
  }
];

let failures = 0;

for (const testCase of tests) {
  try {
    testCase.fn();
    console.log(`PASS ${testCase.name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${testCase.name}`);
    console.error(error.stack);
  }
}

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${tests.length} tests passed.`);
