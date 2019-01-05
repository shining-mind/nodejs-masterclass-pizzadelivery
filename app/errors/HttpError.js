class HttpError extends Error {
    constructor(...args) {
        super(...args);
        this.code = 500;
        this.message = 'Internal Server Error';
    }
}

module.exports = HttpError;