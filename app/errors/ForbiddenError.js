const HttpError = require('./HttpError');

class ForbiddenError extends HttpError {
    constructor(...args) {
        super(...args);
        this.code = 403;
        this.defaultMessage('Forbidden');
    }
}

module.exports = ForbiddenError;