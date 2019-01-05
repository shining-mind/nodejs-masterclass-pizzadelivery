const { createServer } = require('http');
const { parse } = require('url');
const { StringDecoder } = require('string_decoder');
const { HttpError, NotFoundError, BadRequestError } = require('./errors');
const routes = require('./routes');

/**
 * @param {Function} handler
 * 
 * @returns {Function} 
 */
const handlerResponseDecorator = (handler) => {
    return async (...args) => {
        try {
            const payload = args[0] !== '' ? JSON.parse(args[0]) : {};
            const ctx = args[1];
            const body = await handler.apply(this, [payload, ctx]);
            return {
                statusCode: 200,
                body: typeof body === 'object' ? body : {},
            };
        } catch (error) {
            let responseError = error;
            if (error instanceof SyntaxError) {
                responseError = new BadRequestError();
            } else if ((error instanceof HttpError) === false) {
                responseError = new HttpError();
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
    let buffer = '';
    const decoder = new StringDecoder('utf-8');
    req.on('data', data => buffer += decoder.write(data));
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const handler = chooseHandler(path.split('/'));
    const ctx = {
        uri: req.url,
        query: parsedUrl.query,
        pathname: path,
        headers: req.headers,
    };
    const sendResponse = async (payload) => {
        const { statusCode, body } = await handler(payload, ctx);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(body));
    };
    // TODO: add to routes http method bind
    // for bodyless methods don't wait for end event
    // just send response
    req.on('end', () => {
        buffer += decoder.end();
        sendResponse(buffer);
    });
});

module.exports = server;
