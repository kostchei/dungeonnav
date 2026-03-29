import fs from 'fs';

const dir = './';

function R(file, regex, rep) {
  let text = fs.readFileSync(dir + file, 'utf8');
  text = text.replace(regex, rep);
  fs.writeFileSync(dir + file, text);
}

// 1. package.json
let pkg = fs.readFileSync('package.json', 'utf8');
if (!pkg.includes('"type": "module"')) {
  pkg = pkg.replace(/"private": true,/, '"private": true,\n  "type": "module",');
  fs.writeFileSync('package.json', pkg);
}

// 2. config
R('src/config/level1-data.js', /module\.exports = \{([^}]+)\};/m, 'export default {$1};');

// 3. dice
R('src/combat/dice.js', /module\.exports = \{([^}]+)\};/m, 'export {$1};');

// 4. resolver
R('src/combat/resolver.js', /const \{ ([^}]+) \} = require\("\.\/dice"\);/, 'import { $1 } from "./dice.js";');
R('src/combat/resolver.js', /module\.exports = \{([^}]+)\};/m, 'export default {$1};');

// 5. progression
R('src/player/progression.js', /const \{ ([^}]+) \} = require\("\.\.\/config\/level1-data"\);/, 'import configModule from "../config/level1-data.js";\nconst { $1 } = configModule;');
R('src/player/progression.js', /module\.exports = \{([^}]+)\};/m, 'export default {$1};');

// 6. reckless-attack
R('src/player/reckless-attack.js', /module\.exports = \{([^}]+)\};/m, 'export default {$1};');

// 7. encounters
R('src/world/encounters.js', /const \{ ([^}]+) \} = require\("\.\.\/config\/level1-data"\);/, 'import configModule from "../config/level1-data.js";\nconst { $1 } = configModule;');
R('src/world/encounters.js', /module\.exports = \{([^}]+)\};/m, 'export default {$1};');

// 8. test files
['test/combat.test.js', 'test/encounters.test.js', 'test/progression.test.js', 'test/run-tests.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let text = fs.readFileSync(file, 'utf8');
  
  text = text.replace(/const test = require\("node:test"\);/g, 'import test from "node:test";');
  text = text.replace(/const assert = require\("node:assert(\/strict)?"\);/g, 'import assert from "node:assert$1";');

  text = text.replace(/const \{([^}]+)\} = require\("\.\.\/src\/combat\/resolver"\);/g, 'import resolverModule from "../src/combat/resolver.js";\nconst {$1} = resolverModule;');
  text = text.replace(/const \{([^}]+)\} = require\("\.\.\/src\/combat\/dice"\);/g, 'import { $1 } from "../src/combat/dice.js";');
  text = text.replace(/const \{([^}]+)\} = require\("\.\.\/src\/player\/progression"\);/g, 'import progressionModule from "../src/player/progression.js";\nconst {$1} = progressionModule;');
  text = text.replace(/const \{([^}]+)\} = require\("\.\.\/src\/player\/reckless-attack"\);/g, 'import recklessModule from "../src/player/reckless-attack.js";\nconst {$1} = recklessModule;');
  text = text.replace(/const \{([^}]+)\} = require\("\.\.\/src\/world\/encounters"\);/g, 'import encountersModule from "../src/world/encounters.js";\nconst {$1} = encountersModule;');
  text = text.replace(/const \{([^}]+)\} = require\("\.\.\/src\/config\/level1-data"\);/g, 'import configModule from "../src/config/level1-data.js";\nconst {$1} = configModule;');
  
  fs.writeFileSync(file, text);
});

console.log('Done rewriting requires to imports!');
