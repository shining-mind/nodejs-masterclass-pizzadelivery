const { performance } = require('perf_hooks');

let failed = 0;
let successful = 0;
let count = 0;
let tests = [];

module.exports = {
    it(description, test) {
        count += 1;
        tests.push(
            {
                description,
                test,
            }
        );
    },
    _getStats() {
        return {
            count,
            failed,
            successful,
        }
    },
    _reset() {
        tests = [];
    },
    _run() {
        return new Promise(async (resolve) => {
            for (let i = 0; i < tests.length; i++) {
                const { description, test } = tests[i];
                const start = performance.now();
                const outputTiming = () => {
                    const ms = Math.round(performance.now() - start);
                    if (ms > 5) {
                        return ` (${ms} ms)`;
                    }
                    return '';
                }
                try {
                    await test();
                    console.log('\u2705  %s%s', description, outputTiming());
                    successful += 1;
                } catch (error) {
                    console.log('\u274c  %s%s', description, outputTiming());
                    console.log('\x1b[31m%s: %s\x1b[0m', error.name, error.message);
                    failed += 1;
                }
            }
            resolve();
        });
    }
};
