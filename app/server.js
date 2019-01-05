const { createServer } = require('http');
const { parse } = require('url');
const { StringDecoder } = require('string_decoder');
const {
    HttpError,
    NotFoundError,
    BadRequestError,
    InternalServerError,
} = require('./errors');
const routes = require('./routes');

const BODYLESS_METHODS = [
    'get',
    'head',
    'options',
    'delete',
];

/**
 * @param {Function} handler
 * 
 * @returns {Function} 
 */
const handlerResponseDecorator = (handler) => {
    return async (...args) => {
        try {
            const ctx = args[1];
            ctx.payload = args[0] !== '' ? JSON.parse(args[0]) : {};
            const body = await handler.apply(this, [ctx]);
            return {
                statusCode: 200,
                body: typeof body === 'object' ? body : {},
            };
        } catch (error) {
            let responseError = error;
            if (error instanceof SyntaxError) {
                responseError = new BadRequestError();
            } else if ((error instanceof HttpError) === false) {
                responseError = new InternalServerError();
            }
            return {
                statusCode: responseError.code,
                body: {
                    error: {
                        message: responseError.message,
                    }
                }
            }
        }
    };
};

/**
 * @param {Array} routeParts
 * 
 * @returns {Function}
 */
const chooseHandler = (routeParts) => {
    let searchRoute = routes;
    let handler = () => {
        throw new NotFoundError();
    };
    for (let i = 0; i < routeParts.length; i++) {
        const part = routeParts[i];
        if (typeof searchRoute[part] === 'function') {
            handler = searchRoute[part];
        } else if (typeof searchRoute[part] === 'object') {
            searchRoute = searchRoute[part];
        }
    }
    return handlerResponseDecorator(handler);
};


const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const handler = chooseHandler(path.split('/'));
    const ctx = {
        uri: req.url,
        query: parsedUrl.query,
        pathname: path,
        headers: req.headers,
        method: req.method.toLowerCase(),
        app: {},
    };
    /**
     * @param {String} payload 
     */
    const sendResponse = async (payload) => {
        const { statusCode, body } = await handler(payload, ctx);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(body));
    };
    if (BODYLESS_METHODS.indexOf(ctx.method) !== -1) {
        sendResponse('');
    } else {
        let buffer = '';
        const decoder = new StringDecoder('utf-8');
        req.on('data', data => buffer += decoder.write(data));
        req.on('end', () => {
            buffer += decoder.end();
            sendResponse(buffer);
        });
    }
});

module.exports = server;
