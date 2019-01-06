# nodejs-masterclass-pizzadelivery
Nodejs Masterclass | Pizza Delivery API | Homework #2

## Prerequisites

1. node 8 LTS or greater
2. postman app for interaction with API

## API

[Postman Docs](https://documenter.getpostman.com/view/2647022/RznEJxor)

## Start

```bash
npm start
```

or 

```bash
node ./index.js
```

Application will start on default port 3000.
To use another port, please change env variable `SERVER_PORT` to your desired port number.

## Testing

```
npm test
```

or

```bash
node ./test.js
```

## Directory structure

```
app/ - application business logic
- routes/
-- tokens.js
-- users.js
-- index.js - all handlers
- errors/
-- HttpError.js - basic http error which can be sent as response to API user, statusCode 500
-- BadRequestError.js - response with statusCode 400
-- NotFoundError.js - response with statusCode 404
-- ... - other HTTP errors
-- index.js - all errors
- server.js - server logic
- storage.js - storage driver for application
- Validator.js - validator with application specific schema extensions
config/
- index.js
lib/
- tests/ - testing library
- hash/ - hash helpers
- store/ - storage driver
- helpers/
- validation/ - validation library
- Pipeline.js - helper for sending passables through pipeline of callables
storage/
- app/ - application storage
```