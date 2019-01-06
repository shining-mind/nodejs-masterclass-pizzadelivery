const ValidationError = require('./ValidationError');

class ValidationValidError extends ValidationError {
    getMessage() {
        return `Item '${this.itemName}' is expected to be one of ${this.params.valid.map(i => `'${i}'`).join(',')}`;
    }
};

module.exports = ValidationValidError;
