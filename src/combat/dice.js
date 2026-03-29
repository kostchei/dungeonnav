function rollDie(sides, rng = Math.random) {
  if (!Number.isInteger(sides) || sides < 2) {
    throw new Error("sides must be an integer greater than 1");
  }

  return Math.floor(rng() * sides) + 1;
}

function rollD20(rng = Math.random) {
  return rollDie(20, rng);
}

function parseDamageExpression(expression) {
  const match = /^(\d+)d(\d+)([+-]\d+)?$/i.exec(expression);
  if (!match) {
    throw new Error(`Invalid damage expression: ${expression}`);
  }

  return {
    diceCount: Number(match[1]),
    diceSides: Number(match[2]),
    modifier: Number(match[3] || 0)
  };
}

function rollDamage(expression, rng = Math.random) {
  const parsed = parseDamageExpression(expression);
  let total = parsed.modifier;

  for (let index = 0; index < parsed.diceCount; index += 1) {
    total += rollDie(parsed.diceSides, rng);
  }

  return {
    ...parsed,
    total
  };
}

module.exports = {
  parseDamageExpression,
  rollD20,
  rollDamage,
  rollDie
};
