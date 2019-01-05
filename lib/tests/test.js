const { performance } = require('perf_hooks');
const { failure, success } = require('./reporter');

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
                    success(description, outputTiming());
                    successful += 1;
                } catch (error) {
                    failure(error, description, outputTiming());
                    failed += 1;
                }
            }
            resolve();
        });
    }
};
