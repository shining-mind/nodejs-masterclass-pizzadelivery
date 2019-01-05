const assert = require('assert');
const { MethodNotAllowedError, UnprocessableEntityError } = require('../errors');
const Pipeline = require('../../lib/Pipeline');
const Storage = require('../../lib/store/Storage');

/**
 * @property {String[]} allowedMethods
 * @property {Function[]} middleware
 * @property {Storage} storage
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
        storage,
    } = {}) {
        assert(storage instanceof Storage);
        this.allowedMethods = allowedMethods;
        this.middleware = middleware;
        this.storage = storage;
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
}

module.exports = RouteController;