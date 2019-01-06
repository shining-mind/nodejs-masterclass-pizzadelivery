'use strict';

const assert = require('assert');
const ObjectSchema = require('./ObjectSchema');
const Validator = require('../Validator');

it('should validate keys', () => {
    const schema = new ObjectSchema();
    schema.keys({
        a: Validator.string().default('a'),
        b: Validator.number().valid(1, 2).required(),
        c: Validator.array().required()
    });
    const validated = schema.matches({
        b: 1,
        c: [1, 2, 3]
    });
    assert.deepEqual(validated, {
        a: 'a',
        b: 1,
        c: [1, 2, 3],
    });
});

it('should fail if object has disallowed keys', () => {
    const schema = new ObjectSchema();
    schema.keys({
        a: Validator.string().default('a'),
        b: Validator.number().valid(1, 2).required(),
    });
    try {
        schema.matches({
            b: 1,
            c: [1, 2, 3]
        });
        assert.fail('Should have failed');
    } catch (error) {
        assert.equal(error.message, "Item '' has disallowed keys: 'c'");
    }
});

