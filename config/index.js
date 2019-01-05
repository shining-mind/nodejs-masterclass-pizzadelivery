const { env } = process;

module.exports = {
    port: env.SERVER_PORT || 3000,
};
