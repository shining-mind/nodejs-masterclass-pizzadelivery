const fs = require('fs');
const path = require('path');
const test = require('./test');
const hooks = require('./hooks');
const { symbols, color } = require('./reporter');

global.it = test.it;
global.before = hooks.before;
global.after = hooks.after;

function outputInfo() {
    const { count, failed, successful } = test._getStats();
    console.log(color('comment', 'Total: %s, successful: %s, failed: %s'), count, successful, failed)
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
                console.log(color('suite title', symbols.suite) + ' ' + currentEntityPath);
                require(currentEntityPath);
                const done = await hooks._run('before');
                if (done) {
                    await test._run();
                    await hooks._run('after');
                }
                hooks._reset();
                test._reset();
            } 
            next();
        };
        processEntity(contents[i]);
    });
}
