const { MethodNotAllowedError, UnprocessableEntityError } = require('../errors');
const Pipeline = require('../../lib/Pipeline');
const storage = require('../storage');
const Validator = require('../Validator');
const config = require('../../config');

/**
 * @property {String[]} allowedMethods
 * @property {Function[]} middleware
 * @property {Storage} storage
 * @property {Object} config
 */
class RouteController {
    constructor({
        allowedMethods = [
            'get',
            'post',
            'put',
            'delete',
        ],
        middleware = [],
    } = {}) {
        this.allowedMethods = allowedMethods;
        this.middleware = middleware;
        this.storage = storage;
        this.Validator = Validator;
        this.config = config;
    }

    /**
     * @param {Object} ctx
     */
    async handleRequest(ctx) {
        if (this.allowedMethods.indexOf(ctx.method) === -1) {
            throw new MethodNotAllowedError();
        }
        const method = `_${ctx.method}`;
        if (typeof this[method] !== 'function') {
            throw new UnprocessableEntityError(`Handler for '${ctx.method}' method not found`);
        }
        return new Pipeline()
            .send(ctx)
            .through(this.getMiddleware(ctx.method))
            .then(this[method].bind(this));
    }


    /**
     * @param {String} method
     * 
     * @returns {Array}
     */
    getMiddleware(method) {
        return this.middleware;
    }

    /**
     * @param {Object} payload
     * @param {Object} rules
     * 
     * @returns {Object}
     */
    validate(payload, rules) {
        const schema = this.Validator.object().keys(rules).required();
        schema.name = 'request body';
        const { error, value } = this.Validator.validate(payload, schema);
        if (error) {
            throw new UnprocessableEntityError(error.message);
        }
        return value;
    }
}

module.exports = RouteController;