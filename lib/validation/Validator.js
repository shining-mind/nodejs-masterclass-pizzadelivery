const Schema = require('./Schema');
const schemas = require('./schemas');
const errors = require('./errors');

const extensions = {
    default: [],
};
Object.keys(schemas).forEach(key => extensions[key] = []);

class Validator {
    static validate(value, schema) {
        const result = {
            error: null,
            value: null,
        };
        try {
            result.value = schema.matches(value)
        } catch (error) {
            result.error = error;
        }
        return result;
    }

    static assert(value, schema) {
        schema.matches(value);
    }

    static schema() {
        return Validator._createSchemaProxy(new Schema());
    }

    static string() {
        return Validator._createSchemaProxy(new schemas.string());
    }

    static number() {
        return Validator._createSchemaProxy(new schemas.number());
    }

    static object() {
        return Validator._createSchemaProxy(new schemas.object());
    }

    static array() {
        return Validator._createSchemaProxy(new schemas.array());
    }

    static extend(schemaName, extension) {
        if (extensions[schemaName] === undefined) {
            throw new TypeError(`Schema doesn't exist '${schemaName}'`);
        }
        extensions[schemaName].push(extension);
    }

    static _createSchemaProxy(schema) {
        schema.setExtensions(extensions[schema.getSchemaType()]);
        return new Proxy(schema, {
            get(target, property) {
                if (Reflect.has(target, property)) {
                    return target[property]
                }
                if (Reflect.has(target.extensions, property)) {
                    return target.extensions[property]
                }
                throw new TypeError(`Schema method/property ${property} doesn't exist`);
            },
        });
    }
}

module.exports = Validator;
