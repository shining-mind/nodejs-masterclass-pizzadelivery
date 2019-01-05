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
        middlewares = [],
    } = {}) {
        this.allowedMethods = allowedMethods;
        this.middlewares = middlewares;
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
            .through(this.middlewares)
            .then(this[method].bind(this));
    }
}

module.exports = RouteController;