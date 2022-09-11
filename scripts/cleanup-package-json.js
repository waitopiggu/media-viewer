const fs = require('fs');
const package = require(process.argv[2]);
const outputDir = process.argv[3]

delete package.dependencies;
delete package.devDependencies;
delete package.scripts;

fs.writeFileSync(
  `${outputDir}/package.json`,
  JSON.stringify(package, null, 2),
);

