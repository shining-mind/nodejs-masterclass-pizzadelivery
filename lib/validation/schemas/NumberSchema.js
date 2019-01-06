const Schema = require('../Schema');

class NumberSchema extends Schema {
    constructor(params) {
        super({ ...params, type: 'number' });
    }

    self() {
        return NumberSchema;
    }
}

module.exports = NumberSchema;
