const THRUD_LEVEL_1_TREASURE_TABLE = {
  common: [
    "Clockwork amulet",
    "Potion of healing",
    "Potion of watchful rest",
    "Silvered greataxe",
  ],
  uncommon: [
    "+1 greataxe",
    "Eyes of the Eagle",
    "Cloak of Protection",
    "+1 shield",
    "Potion of Fire Breath",
    "Potion of Healing (Greater)",
    "Potion of Resistance (Necrotic)",
    "+1 longsword",
  ],
  rare: [
    "Bracers of defence",
    "Potion of Invisibility",
    "Ring of Protection",
  ],
};

const THRUD_LEVEL_1_RARITY_WEIGHTS = {
  common: 5,
  uncommon: 13,
  rare: 2,
};

function chooseWeightedRarity(weights, rng = Math.random) {
  const entries = Object.entries(weights);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rng() * totalWeight;

  for (const [rarity, weight] of entries) {
    roll -= weight;
    if (roll < 0) {
      return rarity;
    }
  }

  return entries[entries.length - 1][0];
}

function chooseRandomItem(items, rng = Math.random) {
  return items[Math.floor(rng() * items.length)];
}

function chooseThrudLevel1Treasure(rng = Math.random) {
  const rarity = chooseWeightedRarity(THRUD_LEVEL_1_RARITY_WEIGHTS, rng);
  const item = chooseRandomItem(THRUD_LEVEL_1_TREASURE_TABLE[rarity], rng);

  return {
    item,
    rarity,
  };
}

module.exports = {
  THRUD_LEVEL_1_TREASURE_TABLE,
  THRUD_LEVEL_1_RARITY_WEIGHTS,
  chooseThrudLevel1Treasure,
  chooseWeightedRarity,
  chooseRandomItem,
};
