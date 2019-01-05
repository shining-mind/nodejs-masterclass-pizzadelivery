# nodejs-masterclass-pizzadelivery
Nodejs Masterclass | Pizza Delivery API | Homework #2

## Directory structure

```
app
- routes/
-- index.js - all handlers
- errors/
-- HttpError.js - basic http error which can be sent as response to API user, statusCode 500
-- BadRequestError.js - response with statusCode 400
-- NotFoundError.js - response with statusCode 404
-- index.js - all errors
- server.js - server logic
config
- index.js
```

## Start

```bash
npm start
```

Application will start on default port 3000.
To use another port, please change env variable `SERVER_PORT` to your desired port number.

## Testing

```
npm test
```