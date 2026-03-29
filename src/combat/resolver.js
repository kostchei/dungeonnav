const { rollD20, rollDamage } = require("./dice");

function getAttackModifier({ rageActive = false, meleeBonus = 0, recklessAttack = false } = {}) {
  return {
    meleeBonus,
    rageDamageBonus: rageActive ? 2 : 0,
    hasAdvantage: Boolean(recklessAttack)
  };
}

function rollAttackD20({ recklessAttack = false } = {}, rng = Math.random) {
  if (!recklessAttack) {
    const roll = rollD20(rng);
    return { roll, rolls: [roll], hasAdvantage: false };
  }

  const first = rollD20(rng);
  const second = rollD20(rng);
  return {
    roll: Math.max(first, second),
    rolls: [first, second],
    hasAdvantage: true
  };
}

function resolveAttack({
  attackBonus,
  armorClass,
  damageExpression,
  rageActive = false,
  meleeBonus = 0,
  recklessAttack = false
}, rng = Math.random) {
  const d20Result = rollAttackD20({ recklessAttack }, rng);
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
  const modifier = getAttackModifier({ rageActive, meleeBonus, recklessAttack });
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

module.exports = {
  applyDamageMitigation,
  getAttackModifier,
  resolveAttack,
  rollAttackD20
};
