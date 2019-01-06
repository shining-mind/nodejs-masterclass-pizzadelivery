const Validator = require('../lib/validation/Validator');

Validator.extend('string', {
    name: 'email',
    errorMessage: `Item '%s' should be valid email`,
    rule(ruleSchema) {
        return ruleSchema.regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
    },
});

module.exports = Validator;