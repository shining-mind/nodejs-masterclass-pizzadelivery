const RouteController = require('../base/RouteController');
const { authenticated } = require('../middleware');

class UsersController extends RouteController {
    getMiddleware(method) {
        if (method === 'post') {
            return [];
        }
        return super.getMiddleware(method);
    }
    _post() {
        return { message: 'User created' };
    }

    _get() {
        return { message: 'User extracted' };
    }

    _put() {
        return { message: 'User updated' };
    }

    _delete() {
        return { message: 'User deleted' };
    }
}

const controller = new UsersController({
    middleware: [
        authenticated,
    ],
});

module.exports = controller.handleRequest.bind(controller);