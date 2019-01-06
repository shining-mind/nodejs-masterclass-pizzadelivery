const assert = require('assert');
const Schema = require('../Schema');
const arrayDiff = require('../../helpers/arrayDiff');
const errors = require('../errors');

class ObjectSchema extends Schema {
    constructor(params) {
        super({ ...params, type: 'object' });
        this._properties.keys = {};
    }

    self() {
        return ObjectSchema;
    }

    matches(value) {
        let validated = super.matches(value);
        if (this._isValidType(validated)) {
            validated = this._validateKeys(validated);
        }
        return validated;
    }

    keys(keys) {
        assert(typeof keys === 'object' && keys !== null, 'Expected keys to be an object');
        this._properties.keys = keys;
        return this;
    }

    _validateKeys(value) {
        if (this._properties.keys === {}) {
            return value;
        }
        const validated = {};
        const valueKeys = Object.keys(value);
        const keysToValidate = Object.keys(this._properties.keys);
        const diff = arrayDiff(valueKeys, keysToValidate);
        if (diff.length > 0) {
            throw new errors.ValidationDisallowedKeysError(this.name, { keys: diff });
        }
        keysToValidate.forEach((key) => {
            const schema = this._properties.keys[key];
            if (!(schema instanceof Schema)) {
                throw new TypeError(`${key} should be instanceof Schema`);
            }
            schema.name = key;
            validated[key] = schema.matches(value[key]);
        });
        return validated;
    }


}

module.exports = ObjectSchema;
