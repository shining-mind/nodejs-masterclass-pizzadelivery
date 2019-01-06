const Schema = require('../Schema');
const errors = require('../errors');

class StringSchema extends Schema {
    constructor(params = {}) {
        super({ ...params, type: 'string' });
        const { trimValue = true } = params;
        this.trimValue = trimValue;
    }

    self() {
        return StringSchema;
    }

    matches(value) {
        let validated = super.matches(value);
        if (this._isValidType(validated)) {
            if (this.trimValue) {
                validated = validated.trim();
            }
            this._assertRegex(validated);
            this._assertLength(validated);
            this._assertMax(validated);
            this._assertMin(validated);
        }
        return validated;
    }

    regex(re) {
        this._properties.regex = re;
        return this;
    }

    length(length) {
        this._properties.length = length;
        return this;
    }

    min(min) {
        this._properties.min = min;
        return this;
    }

    max(max) {
        this._properties.max = max;
        return this;
    }

    _assertRegex(value) {
        const { regex } = this._properties;
        if (regex !== undefined && !value.match(regex)) {
            throw new errors.ValidationRegexError(this.name, { regex });
        }
    }

    _assertLength(value) {
        const { length } = this._properties;
        if (length !== undefined && value.length !== length) {
            throw this.prepareValidationError(`Item '%s' length should be equal to ${length} symbols`);
        }
    }

    _assertMin(value) {
        const { min } = this._properties;
        if (min !== undefined && value.length < min) {
            throw this.prepareValidationError(`Item '%s' length should be greater than or equal to ${min} symbols`);
        }
    }

    _assertMax(value) {
        const { max } = this._properties;
        if (max !== undefined && value.length > max) {
            throw this.prepareValidationError(`Item '%s' length should be less than or equal to ${max} symbols`);
        }
    }
}

module.exports = StringSchema;
