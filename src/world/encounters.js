import configModule from "../config/level1-data.js";
const { ENEMY_DEFS, LEVEL_1_ENCOUNTERS } = configModule;

function getEncounterXpTotal(encounter, enemyDefs = ENEMY_DEFS) {
  return encounter.enemyList.reduce((total, enemyId) => total + enemyDefs[enemyId].xpValue, 0);
}

function getLevelXpTotal(encounters = LEVEL_1_ENCOUNTERS, enemyDefs = ENEMY_DEFS) {
  return encounters.reduce((total, encounter) => total + getEncounterXpTotal(encounter, enemyDefs), 0);
}

function buildEncounterSummary(encounters = LEVEL_1_ENCOUNTERS, enemyDefs = ENEMY_DEFS) {
  return encounters.map((encounter) => ({
    id: encounter.id,
    areaId: encounter.areaId,
    enemyCount: encounter.enemyList.length,
    xpTotal: getEncounterXpTotal(encounter, enemyDefs)
  }));
}

export default {
  buildEncounterSummary,
  getEncounterXpTotal,
  getLevelXpTotal
};
