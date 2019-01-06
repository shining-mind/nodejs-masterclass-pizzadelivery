'use strict';

const assert = require('assert');
const StringSchema = require('./StringSchema');
const Validator = require('../Validator');

it('should validate using regex', () => {
    const schema = new StringSchema({ name: 'test' });
    const regex = /simple[\d]{3}/;
    schema.regex(regex).matches('simple123');
    try {
        schema.matches('simple1');
    } catch (error) {
        assert.equal(error.message, `Item 'test' should match pattern: ${regex}`);
    }
});

it('should extend and match', () => {
    Validator.extend('string', {
        name: 'email',
        errorMessage: `Item '%s' should be valid email`,
        rule(ruleSchema) {
            return ruleSchema.regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
        }
    })
    const schema = Validator.string().email().required();
    schema.name = 'test';
    const email = 'petrov@mail.com';
    assert.equal(schema.matches(email), email);
    try {
        schema.matches('simple1');
        assert.fail();
    } catch (error) {
        assert.equal(error.message, 'Item \'test\' should be valid email');
    }
});

it('validate max', () => {
    const schema = Validator.string().max(4);
    schema.matches('abc');
    try {
        schema.matches('abcde');
        assert.fail();
    } catch (error) {
        assert.equal(error.message, "Item '' length should be less than or equal to 4 symbols")
    }
});

it('validate min', () => {
    const schema = Validator.string().min(3);
    schema.matches('abc');
    try {
        schema.matches('ab');
        assert.fail();
    } catch (error) {
        assert.equal(error.message, "Item '' length should be greater than or equal to 3 symbols")
    }
});

it('validate min and max', () => {
    const schema = Validator.string().min(3).max(4);
    schema.matches('abc');
    try {
        schema.matches('ab');
        assert.fail();
    } catch (error) {
        assert.equal(error.message, "Item '' length should be greater than or equal to 3 symbols")
    }
    try {
        schema.matches('abcde');
        assert.fail();
    } catch (error) {
        assert.equal(error.message, "Item '' length should be less than or equal to 4 symbols")
    }
});

it('validate length', () => {
    const schema = Validator.string().length(5);
    schema.matches('abcde');
    try {
        schema.matches('ab');
        assert.fail();
    } catch (error) {
        assert.equal(error.message, "Item '' length should be equal to 5 symbols")
    }
});
