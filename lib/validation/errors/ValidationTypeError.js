const ValidationError = require('./ValidationError');

class ValidationTypeError extends ValidationError {
    getMessage() {
        return `Item '${this.itemName}' is expected to be a '${this.params.type}'`;
    }
};

module.exports = ValidationTypeError;
