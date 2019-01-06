const ValidationError = require('./ValidationError');

class ValidationRegexError extends ValidationError {
    getMessage() {
        return `Item '${this.itemName}' should match pattern: ${this.params.regex}`;
    }
};

module.exports = ValidationRegexError;
