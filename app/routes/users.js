const RouteController = require('../base/RouteController');

class UsersController extends RouteController {
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

const controller = new UsersController();

module.exports = controller.handleRequest.bind(controller);