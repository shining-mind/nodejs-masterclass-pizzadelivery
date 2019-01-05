const fs = require('fs');
const path = require('path');
const test = require('./test');

global.it = test.it;

function outputInfo() {
    const { count, failed, successful } = test._getStats();
    console.log('\n\x1b[33mTotal: %s, successful: %s, failed: %s\x1b[0m', count, successful, failed);
}

/**
 * Run tests from specified directory
 *
 * @param {String} baseDir 
 */
module.exports = function run(baseDir, level = 0) {
    let i = 0;
    const contents = fs.readdirSync(baseDir);
    return new Promise((resolve) => {
        /**
         * Process entity
         * @param {String} entity
         */
        const processEntity = async (entity) => {
            // All entities from current directory have been processed
            if (!entity) {
                // All entities from root directory have been processed
                if (level === 0) {
                    outputInfo();
                }
                return resolve();
            }
            const currentEntityPath = path.join(baseDir, entity);
            const next = () => {
                setImmediate(() => processEntity(contents[++i]));
            };
            const statInfo = fs.statSync(currentEntityPath);
            if (statInfo.isDirectory()) {
                await run(currentEntityPath, level + 1);
            }
            if (statInfo.isFile() && entity.match(/\.spec\.js$/)) {
                console.log('\n\u23f3  %s', currentEntityPath);
                require(currentEntityPath);
                await test._run();
                test._reset();
            } 
            next();
        };
        processEntity(contents[i]);
    });
}
