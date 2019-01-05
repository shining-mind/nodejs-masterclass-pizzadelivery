const crypto = require('crypto');

module.exports = {
    hash(string) {
        const salt = crypto.randomBytes(10).toString('hex');
        const hash = crypto.createHmac('sha256', salt)
            .update(string)
            .digest('hex');
        return {
            salt,
            hash,
        };
    },
    verify(raw, hash, salt) {
        const hashToVerify = crypto.createHmac('sha256', salt)
            .update(raw)
            .digest('hex');
        return hashToVerify === hash;
    },
};
