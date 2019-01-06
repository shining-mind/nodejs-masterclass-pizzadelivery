const { env } = process;

module.exports = {
    // Server port
    port: parseInt(env.SERVER_PORT, 10) || 3000,
    // Token time to live in ms
    tokenTTL: parseInt(env.TOKEN_TTL, 10) || 60 * 60 * 1000,
};
