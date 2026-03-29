import { rollD20, rollDamage } from "./dice.js";

function getAttackModifier({ rageActive = false, meleeBonus = 0 } = {}) {
  return {
    meleeBonus,
    rageDamageBonus: rageActive ? 2 : 0
  };
}

function rollAttackD20(rng = Math.random) {
  const roll = rollD20(rng);
  return { roll, rolls: [roll], hasAdvantage: false };
}

function resolveAttack({
  attackBonus,
  armorClass,
  damageExpression,
  rageActive = false,
  meleeBonus = 0
}, rng = Math.random) {
  const d20Result = rollAttackD20(rng);
  const natural20 = d20Result.rolls.includes(20);
  const totalAttack = d20Result.roll + attackBonus;
  const hit = natural20 || totalAttack >= armorClass;

  if (!hit) {
    return {
      hit: false,
      crit: false,
      totalAttack,
      d20: d20Result
    };
  }

  const damageRoll = rollDamage(damageExpression, rng);
  const modifier = getAttackModifier({ rageActive, meleeBonus });
  let totalDamage = damageRoll.total + modifier.meleeBonus + modifier.rageDamageBonus;

  if (natural20) {
    const critBonus = rollDamage(damageExpression, rng);
    totalDamage += critBonus.total - damageRoll.modifier;
  }

  return {
    hit: true,
    crit: natural20,
    totalAttack,
    damage: totalDamage,
    d20: d20Result
  };
}

function applyDamageMitigation(damage, { rageActive = false, damageType = "physical" } = {}) {
  if (!rageActive) {
    return damage;
  }

  if (damageType === "slashing" || damageType === "piercing" || damageType === "bludgeoning" || damageType === "physical") {
    return Math.floor(damage / 2);
  }

  return damage;
}

export default {
  applyDamageMitigation,
  getAttackModifier,
  resolveAttack,
  rollAttackD20
};
