class HttpError extends Error {
    constructor(...args) {
        super(...args);
        this.code = 500;
        this.defaultMessage('Internal Server Error');
    }

    /**
     * Sets the default message for the error
     * if there is none
     * @param {*} message 
     */
    defaultMessage(message) {
        if (!this.message) {
            this.message = message;
        }
    }
}

module.exports = HttpError;