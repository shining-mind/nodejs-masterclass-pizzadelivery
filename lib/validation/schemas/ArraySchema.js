const Schema = require('../Schema');

class ArraySchema extends Schema {
    constructor(params) {
        super({ ...params, type: 'array' });
    }

    self() {
        return ArraySchema;
    }
}

module.exports = ArraySchema;
