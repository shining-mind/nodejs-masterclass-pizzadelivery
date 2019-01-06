const { UnauthorizedError } = require('../errors');
const storage = require('../storage');

module.exports = function authenticated(ctx, next) {
    const { authorization } = ctx.headers;
    let matches = [];
    if (!authorization || typeof authorization !== 'string' || !(matches = authorization.match(/^Bearer (.{32})$/))) {
        throw new UnauthorizedError();
    }
    const tokenId = matches[1];
    return storage.collection('tokens').read(tokenId).then((token) => {
        if (!token || !token.id) {
            throw new UnauthorizedError('Invalid token');
        }
        if (token.expires < Date.now()) {
            throw new UnauthorizedError('Expired token');
        }
        ctx.app.token = token;
        return storage.collection('users').read(token.userId);
    })
        .catch(error => Promise.reject(error instanceof UnauthorizedError ? error : new UnauthorizedError()))
        .then((user) => {
            if (!user || !user.id) {
                throw new UnauthorizedError();
            }
            ctx.app.user = user;
            return next(ctx);
        });
};
