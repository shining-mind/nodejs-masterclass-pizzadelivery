const HttpError = require('./HttpError');

class UnauthorizedError extends HttpError {
    constructor(...args) {
        super(...args);
        this.code = 401;
        this.defaultMessage('Unauthorized');
    }
}

module.exports = UnauthorizedError;