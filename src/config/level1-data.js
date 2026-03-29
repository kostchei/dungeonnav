const LEVEL_2_XP_THRESHOLD = 300;

const PLAYER_LEVELS = {
  1: {
    level: 1,
    maxHp: 18,
    meleeBonus: 0,
    recoveryBonus: 0,
    unlockFlags: {
      recklessAttack: false
    }
  },
  2: {
    level: 2,
    maxHp: 31,
    meleeBonus: 1,
    recoveryBonus: 1,
    unlockFlags: {
      recklessAttack: true
    }
  }
};

const ENEMY_DEFS = {
  kobold: {
    id: "kobold",
    displayName: "Kobold",
    faction: "kobolds",
    armorClass: 12,
    maxHp: 5,
    moveSpeed: 1.1,
    attackBonus: 4,
    damageExpression: "1d4+2",
    damageType: "piercing",
    attackRange: 1.5,
    attackArc: 70,
    aggroRange: 10,
    behaviorRole: "skirmisher",
    specialTraits: ["rangedHarass"],
    xpValue: 25
  },
  giantCentipede: {
    id: "giantCentipede",
    displayName: "Giant Centipede",
    faction: "vermin",
    armorClass: 13,
    maxHp: 5,
    moveSpeed: 1.25,
    attackBonus: 4,
    damageExpression: "1d4+1",
    damageType: "piercing",
    attackRange: 1.2,
    attackArc: 55,
    aggroRange: 8,
    behaviorRole: "rushHazard",
    specialTraits: [],
    xpValue: 50
  }
};

const LEVEL_1_ENCOUNTERS = [
  {
    id: "a1-scout",
    areaId: "A1",
    enemyList: ["kobold"]
  },
  {
    id: "a2-guard",
    areaId: "A2",
    enemyList: ["kobold"]
  },
  {
    id: "a3-west-room",
    areaId: "A3",
    enemyList: ["kobold", "kobold", "giantCentipede"]
  },
  {
    id: "a5-north-room",
    areaId: "A5",
    enemyList: ["kobold", "kobold", "giantCentipede"]
  },
  {
    id: "a4-main-lair",
    areaId: "A4",
    enemyList: ["kobold", "kobold"]
  }
];

module.exports = {
  ENEMY_DEFS,
  LEVEL_1_ENCOUNTERS,
  LEVEL_2_XP_THRESHOLD,
  PLAYER_LEVELS
};
