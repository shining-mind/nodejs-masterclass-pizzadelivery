const { UnauthorizedError } = require('../errors');
const storage = require('../storage');

module.exports = function authenticated(ctx, next) {
    const { authorization } = ctx.headers;
    let matches = [];
    if (!authorization || typeof authorization !== 'string' || !(matches = authorization.match(/^Bearer (.{32})$/))) {
        throw new UnauthorizedError();
    }
    const token = matches[1];
    // TODO: read from tokens
    return storage.collection('users').read(token)
        .then((user) => {
            if (!user || !user.id) {
                throw new UnauthorizedError();
            }
            ctx.app.user = user;
            return next(ctx);
        })
        .catch(() => Promise.reject(new UnauthorizedError()));
};
