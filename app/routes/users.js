const RouteController = require('../base/RouteController');
const { ForbiddenError, InternalServerError } = require('../errors');
const { authenticated } = require('../middleware');
const { md5, Password } = require('../../lib/hash');

class UsersController extends RouteController {
    getMiddleware(method) {
        if (method === 'post') {
            return [];
        }
        return super.getMiddleware(method);
    }

    _post({ payload }) {
        const { Validator } = this;
        const { firstName, email, address, password } = this.validate(payload, {
            firstName: Validator.string().min(5).required(),
            email: Validator.string().email().required(),
            address: Validator.string().min(5).max(25).required(),
            password: Validator.string().min(6).required(),
        });
        const id = md5(email);
        const { salt, hash: passwordHash } = Password.hash(password.toString());
        return this.storage.collection('users').create(id, {
            id,
            firstName,
            email,
            address,
            passwordHash,
            salt,
        })
            .then(() => {
                return {
                    id,
                };
            })
            .catch((error) => {
                if (error.code === 'EEXIST') {
                    return Promise.reject(new ForbiddenError(`User with email '${email}' exists`));
                }
                return Promise.reject(error);
            });
    }

    _get({ app }) {
        return app.user;
    }

    _put({ app, payload }) {
        const { user } = app;
        const { Validator } = this;
        const { firstName, address, password } = this.validate(payload, {
            firstName: Validator.string().min(5).optional(),
            address: Validator.string().min(5).max(25).optional(),
            password: Validator.string().min(6).optional(),
        });
        let updateFields = {};
        if (firstName) {
            updateFields.firstName = firstName;
        }
        if (address) {
            updateFields.address = address;
        }
        if (password) {
            const { salt, hash: passwordHash } = Password.hash(password.toString());
            updateFields = {
                ...updateFields,
                salt,
                passwordHash,
            };
        }
        return this.storage.collection('users').update(user.id, updateFields)
            .catch(() => Promise.reject(new InternalServerError('Failed to update user')));
    }

    _delete({ app }) {
        return this.storage.collection('users')
            .delete(app.user.id)
            .then(() => {
                return {};
            })
            .catch(() => {
                throw new InternalServerError('Failed to delete user');
            });
    }
}

const controller = new UsersController({
    middleware: [
        authenticated,
    ],
});

module.exports = controller.handleRequest.bind(controller);