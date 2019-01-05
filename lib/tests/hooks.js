const { color } = require('./reporter');

let hooks = {};

module.exports = {
    before(fn) {
        hooks.before = fn;
    },
    after(fn) {
        hooks.after = fn;
    },
    async _run(name) {
        if (typeof hooks[name] === 'function') {
            try {
                await hooks[name]();
            } catch (error) {
                console.log(color('fail', `Failed hook ${name}, reason: ${error.message}`));
                return false;
            }
        }
        return true;
    },
    _reset() {
        hooks = {};
    },
};
