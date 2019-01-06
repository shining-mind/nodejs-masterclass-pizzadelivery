const crypto = require('crypto');
const RouteController = require('../base/RouteController');
const { ForbiddenError, InternalServerError, NotFoundError } = require('../errors');
const { authenticated } = require('../middleware');
const { md5, Password } = require('../../lib/hash');

class TokensController extends RouteController {

    getTokenExpiration() {
        return Date.now() + this.config.tokenTTL;
    }
    
    getMiddleware(method) {
        if (method === 'post') {
            return [];
        }
        return super.getMiddleware(method);
    }

    async _post({ payload }) {
        const { Validator } = this;
        const { email, password } = this.validate(payload, {
            email: Validator.string().email().required(),
            password: Validator.string().required(),
        });
        const userId = md5(email);
        return this.storage.collection('users').read(userId)
            .catch((error) => {
                if (error.code === 'ENOENT') {
                    return Promise.reject(new NotFoundError(`User not found`));
                }
                return Promise.reject(error);
            })
            .then((user) => {
                if (false === Password.verify(password.toString(), user.passwordHash, user.salt)) {
                    return Promise.reject(new ForbiddenError('Wrong password'));
                }
                const tokenId = crypto.randomBytes(16).toString('hex');
                const data = {
                    id: tokenId,
                    userId,
                    expires: this.getTokenExpiration(),
                };
                return this.storage.collection('tokens').create(tokenId, data)
                    .then(() => data);
            });
    }

    _get({ app }) {
        return app.token;
    }

    _put({ app, payload }) {
        const { Validator } = this;
        const { extend } = this.validate(payload, {
            extend: Validator.boolean().optional(),
        });
        if (extend) {
            return this.storage.collection('tokens')
                .update(app.token.id, { expires: this.getTokenExpiration() })
                .then(({ modified }) => modified)
                .catch(() => Promise.reject(new InternalServerError('Failed to extend token')));
        }
        return app.token;
    }

    _delete({ app }) {
        return this.storage.collection('tokens')
            .delete(app.token.id)
            .then(() => {
                return {};
            })
            .catch(() => {
                throw new InternalServerError('Failed to delete token');
            });
    }
}

const controller = new TokensController({
    middleware: [
        authenticated,
    ],
});

module.exports = controller.handleRequest.bind(controller);