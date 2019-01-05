class HttpError extends Error {
    /**
     * Sets the default message for the error
     * if there is none
     * @param {String} message 
     */
    defaultMessage(message) {
        if (!this.message) {
            this.message = message;
        }
    }
}

module.exports = HttpError;