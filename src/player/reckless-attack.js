function createRecklessAttackState() {
  return {
    available: false,
    active: false,
    selfVulnerability: false
  };
}

function syncRecklessAttackAvailability(recklessState, progressionState) {
  return {
    ...recklessState,
    available: Boolean(progressionState.unlockFlags && progressionState.unlockFlags.recklessAttack)
  };
}

function toggleRecklessAttack(recklessState) {
  if (!recklessState.available) {
    return recklessState;
  }

  const active = !recklessState.active;
  return {
    ...recklessState,
    active,
    selfVulnerability: active
  };
}

module.exports = {
  createRecklessAttackState,
  syncRecklessAttackAvailability,
  toggleRecklessAttack
};
