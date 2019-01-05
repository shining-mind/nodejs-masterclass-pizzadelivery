const config = require('./config');
const server = require('./app/server');

server.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
});
