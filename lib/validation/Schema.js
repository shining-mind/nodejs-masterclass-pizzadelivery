const assert = require('assert');
const errors = require('./errors');

/**
 * @property {String} name
 * @property {Boolean} required
 * @property {Array} valid
 * @property {String} type
 * @property {*} default
 * @property {Object<String, Function>} extensions
 */
class Schema {
    constructor({
        name = '',
        type = 'undefined',
        defaultValue = undefined,
        required = false,
        valid = [],
    } = {}) {
        this.name = name;
        this._properties = {
            required,
            valid,
            type,
            default: defaultValue,
        };
        this.extensions = {};
        this.extensionsValidations = [];
        this.errors = {};
    }

    self() {
        return Schema;
    }

    matches(value) {
        this._assertRequired(value);
        this._assertType(value);
        this._assertValid(value);
        const validated = this._validateExtensions(value);
        if (this._properties.default && !validated) {
            return this._properties.default;
        }
        return validated;
    }

    /**
     * @param {Array<Object>} extensions 
     */
    setExtensions(extensions) {
        extensions.forEach((item) => this.extend(item));
    }

    /**
     * @param {Object} extension
     * @param {String} extension.name
     * @param {Function} extension.rule
     * @param {String} extension.errorMessage 
     */
    extend(extension) {
        const { name, rule, errorMessage } = extension;
        assert(
            typeof name === 'string'
            && typeof rule === 'function',
            'Wrong extension'
        );
        assert(this.extensions[name] === undefined, `Extension with name '${name}' already exists`);
        const CurrentSchemaClass = this.self();
        this.extensions[name] = () => {
            const schema = rule(new CurrentSchemaClass({ name: this.name }));
            const validateFn = (value) => {
                try {
                    return schema.matches(value)
                } catch (error) {
                    if (errorMessage) {
                        throw this.prepareValidationError(errorMessage);
                    }
                    throw error;
                }
            };
            this.extensionsValidations.push(validateFn);
            return this;
        };
    }

    required() {
        this._properties.required = true;
        return this;
    }

    optional() {
        this._properties.required = false;
        return this;
    }

    default(value) {
        this._properties.default = value;
        return this;
    }

    valid(...args) {
        this._properties.valid = args;
        if (Array.isArray(args[0])) {
            this._properties.valid = args[0];
        }
        return this;
    }

    getSchemaType() {
        const { type } = this._properties;
        return type === 'undefined' ? 'default' : type;
    }

    getProperties() {
        return this._properties;
    }

    setProperty(property, value) {
        this._properties[property] = value;
    }

    prepareValidationError(message) {
        return new errors.ValidationError(this.name, { message });
    }

    _isValidType(value) {
        switch (this._properties.type) {
            default:
                return typeof value === this._properties.type;
            case 'array':
                return Array.isArray(value);
        }
    }

    _assertRequired(value) {
        if (this._properties.required && !value && !this._isValidType(value)) {
            throw new errors.ValidationRequiredError(this.name);
        }
    }

    _assertType(value) {
        const { type } = this._properties;
        if (value && !this._isValidType(value)) {
            throw new errors.ValidationTypeError(this.name, { type });
        }
    }

    _assertValid(value) {
        const { valid } = this._properties;
        if (valid.length > 0 && valid.indexOf(value) === -1) {
            throw new error.ValidationValidError(this.name, { valid } );
        }
    }

    _validateExtensions(value) {
        let validated = value;
        for (let i = 0; i < this.extensionsValidations.length; i += 1) {
            validated = this.extensionsValidations[i](validated);
        }
        return validated;
    }
}

module.exports = Schema;