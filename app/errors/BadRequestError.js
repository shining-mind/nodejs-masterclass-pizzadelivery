const HttpError = require('./HttpError');

class BadRequestError extends HttpError {
    constructor(...args) {
        super(...args);
        this.code = 400;
        this.message = 'Bad Request';
    }
}

module.exports = BadRequestError;