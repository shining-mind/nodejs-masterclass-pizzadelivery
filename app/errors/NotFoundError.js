const HttpError = require('./HttpError');

class NotFoundError extends HttpError {
    constructor(...args) {
        super(...args);
        this.code = 404;
        this.message = 'Not Found';
    }
}

module.exports = NotFoundError;