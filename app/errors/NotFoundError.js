const HttpError = require('./HttpError');

class NotFoundError extends HttpError {
    constructor(...args) {
        super(...args);
        this.code = 404;
        this.defaultMessage('Not found');
    }
}

module.exports = NotFoundError;