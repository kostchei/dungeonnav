import configModule from "../config/level1-data.js";
const { PLAYER_BASE_STATS } = configModule;

function createPlayerProgressionState() {
  return {
    level: PLAYER_BASE_STATS.level,
    xp: 0,
    maxHp: PLAYER_BASE_STATS.maxHp,
    meleeBonus: PLAYER_BASE_STATS.meleeBonus,
    recoveryBonus: PLAYER_BASE_STATS.recoveryBonus
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

export default {
  addXp,
  createPlayerProgressionState
};
