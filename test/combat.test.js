import test from "node:test";
import assert from "node:assert/strict";

import resolverModule from "../src/combat/resolver.js";
const {
  applyDamageMitigation,
  resolveAttack,
  rollAttackD20
} = resolverModule;
import {  parseDamageExpression, rollDamage  } from "../src/combat/dice.js";

function createSequenceRng(values) {
  let index = 0;
  return () => {
    const value = values[index];
    index += 1;
    return value;
  };
}

test("parseDamageExpression parses standard dice notation", () => {
  assert.deepEqual(parseDamageExpression("1d12+5"), {
    diceCount: 1,
    diceSides: 12,
    modifier: 5
  });
});

test("rollDamage uses supplied rng deterministically", () => {
  const result = rollDamage("2d4+1", createSequenceRng([0.0, 0.5]));
  assert.equal(result.total, 5);
});

test("rollAttackD20 uses supplied rng deterministically", () => {
  const result = rollAttackD20(createSequenceRng([0.1]));
  assert.equal(result.roll, 3);
  assert.equal(result.hasAdvantage, false);
});

test("resolveAttack returns miss when total attack is below AC", () => {
  const result = resolveAttack({
    attackBonus: 4,
    armorClass: 20,
    damageExpression: "1d12+5"
  }, createSequenceRng([0.1]));

  assert.equal(result.hit, false);
  assert.equal(result.crit, false);
});

test("resolveAttack applies rage and melee bonuses on hit", () => {
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
});

test("resolveAttack applies crit bonus damage on natural 20", () => {
  const result = resolveAttack({
    attackBonus: 5,
    armorClass: 50,
    damageExpression: "1d4+2"
  }, createSequenceRng([0.99, 0.0, 0.5]));

  assert.equal(result.hit, true);
  assert.equal(result.crit, true);
  assert.equal(result.damage, 6);
});

test("applyDamageMitigation halves physical damage during rage", () => {
  assert.equal(applyDamageMitigation(9, { rageActive: true, damageType: "slashing" }), 4);
  assert.equal(applyDamageMitigation(9, { rageActive: true, damageType: "fire" }), 9);
});
