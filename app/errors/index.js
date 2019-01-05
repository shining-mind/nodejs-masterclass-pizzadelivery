const HttpError = require('./HttpError');
const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const MethodNotAllowedError = require('./MethodNotAllowedError');
const UnprocessableEntityError = require('./UnprocessableEntityError');
const InternalServerError = require('./InternalServerError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
    HttpError,
    NotFoundError,
    BadRequestError,
    MethodNotAllowedError,
    UnprocessableEntityError,
    InternalServerError,
    UnauthorizedError,
};
