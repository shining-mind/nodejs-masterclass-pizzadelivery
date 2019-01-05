const HttpError = require('./HttpError');

class UnprocessableEntityError extends HttpError {
    constructor(...args) {
        super(...args);
        this.code = 422;
        this.defaultMessage('Unprocessable Entity');
    }
}

module.exports = UnprocessableEntityError;