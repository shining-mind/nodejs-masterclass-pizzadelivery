const { format } = require('util');

class ValidationError extends Error {
    constructor(itemName, params = {}) {
        super();
        this.itemName = itemName;
        this.params = params;
        this.message = this.getMessage();

    }

    /**
     * @returns {String}
     */
    getMessage() {
        return format(this.params.message || `Item '%s' validation failed`, this.itemName);
    }
};

module.exports = ValidationError;
