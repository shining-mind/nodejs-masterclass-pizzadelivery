const HttpError = require('./HttpError');

class MethodNotAllowedError extends HttpError {
    constructor(...args) {
        super(...args);
        this.code = 405;
        this.defaultMessage('Method Not Allowed');
    }
}

module.exports = MethodNotAllowedError;