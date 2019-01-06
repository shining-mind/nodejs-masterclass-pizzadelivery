const s = require('./StringSchema');
const n = require('./NumberSchema');
const a = require('./ArraySchema');
const o = require('./ObjectSchema');
const b = require('./BooleanSchema');

module.exports = {
    string: s,
    number: n,
    array: a,
    object: o,
    boolean: b,
};
