const ValidationError = require('./ValidationError');

class ValidationRequiredError extends ValidationError {
    getMessage() {
        return `Item '${this.itemName}' is required`;
    }
};

module.exports = ValidationRequiredError;
