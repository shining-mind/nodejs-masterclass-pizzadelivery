const HttpError = require('./HttpError');
const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const MethodNotAllowedError = require('./MethodNotAllowedError');
const UnprocessableEntityError = require('./UnprocessableEntityError');
const InternalServerError = require('./InternalServerError');

module.exports = {
    HttpError,
    NotFoundError,
    BadRequestError,
    MethodNotAllowedError,
    UnprocessableEntityError,
    InternalServerError,
};
