const { MethodNotAllowedError, UnprocessableEntityError } = require('../errors');
const Pipeline = require('../../lib/Pipeline');

/**
 * @property {Array} allowedMethods
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