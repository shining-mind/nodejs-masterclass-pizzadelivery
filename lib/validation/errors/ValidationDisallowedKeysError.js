const ValidationError = require('./ValidationError');

class ValidationDisallowedKeysError extends ValidationError {
    getMessage() {
        return `Item '${this.itemName}' has disallowed keys: ${this.params.keys.map(i => `'${i}'`).join(',')}`;
    }
};

module.exports = ValidationDisallowedKeysError;
