const { UnauthorizedError } = require('../errors');
const storage = require('../storage');

module.exports = function authenticated(ctx, next) {
    const { authorization } = ctx.headers;
    let matches = [];
    if (!authorization || typeof authorization !== 'string' || !(matches = authorization.match(/^Bearer (.{32})$/))) {
        throw new UnauthorizedError();
    }
    const token = matches[1];
    return storage.collection('tokens').exists(token).then((exists) => {
        if (!exists) {
            throw new UnauthorizedError();
        }
        return next(ctx);
    });
};
