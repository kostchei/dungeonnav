const { LEVEL_2_XP_THRESHOLD, PLAYER_LEVELS } = require("../config/level1-data");

function createPlayerProgressionState() {
  return {
    level: 1,
    xp: 0,
    maxHp: PLAYER_LEVELS[1].maxHp,
    meleeBonus: PLAYER_LEVELS[1].meleeBonus,
    recoveryBonus: PLAYER_LEVELS[1].recoveryBonus,
    unlockFlags: { ...PLAYER_LEVELS[1].unlockFlags }
  };
}

function addXp(state, amount) {
  if (amount < 0) {
    throw new Error("XP amount must be non-negative");
  }

  const xp = state.xp + amount;
  return {
    ...state,
    xp
  };
}

function getPendingLevelTransition(state) {
  if (state.level >= 2 || state.xp < LEVEL_2_XP_THRESHOLD) {
    return null;
  }

  return {
    fromLevel: state.level,
    toLevel: 2,
    nextStats: PLAYER_LEVELS[2]
  };
}

function applyPendingLevelTransition(state) {
  const transition = getPendingLevelTransition(state);
  if (!transition) {
    return state;
  }

  return {
    ...state,
    level: transition.nextStats.level,
    maxHp: transition.nextStats.maxHp,
    meleeBonus: transition.nextStats.meleeBonus,
    recoveryBonus: transition.nextStats.recoveryBonus,
    unlockFlags: { ...transition.nextStats.unlockFlags }
  };
}

module.exports = {
  addXp,
  applyPendingLevelTransition,
  createPlayerProgressionState,
  getPendingLevelTransition
};
