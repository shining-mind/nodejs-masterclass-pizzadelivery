const Schema = require('../Schema');

class BooleanSchema extends Schema {
    constructor(params) {
        super({ ...params, type: 'boolean' });
    }

    self() {
        return BooleanSchema;
    }
}

module.exports = BooleanSchema;
