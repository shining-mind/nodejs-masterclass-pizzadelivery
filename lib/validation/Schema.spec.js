'use strict';

const assert = require('assert');
const Schema = require('./Schema');
const Validator = require('./Validator');

it('should chain', () => {
    const schema = new Schema();
    schema.required().valid(1, 2);
    const { required, valid } = schema.getProperties();
    assert(required === true && valid.indexOf(1) > -1 && valid.indexOf(2) > - 1);
});

it('should extend', () => {
    const schema = Validator.schema();
    schema.extend({
        name: 'test',
        rule(ruleSchema) {
            return ruleSchema.default('extended');
        },
    });
    assert.equal(schema.test().matches(), 'extended');
});

it('should not extend', () => {
    const schema = Validator.schema();
    try {
        schema.extend({});
        assert.fail('Should have failed');
    } catch (error) {
        assert.equal(error.message, 'Wrong extension');
    }
});

