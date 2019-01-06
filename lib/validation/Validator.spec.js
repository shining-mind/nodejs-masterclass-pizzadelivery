'use strict';

const assert = require('assert');
const Validator = require('./Validator');

it('should create default schema', () => {
    const schema = Validator.schema();
    assert.equal(schema.getSchemaType(), 'default');
});

it('should create string schema', () => {
    const schema = Validator.string();
    assert.equal(schema.getSchemaType(), 'string');
});

it('should create object schema', () => {
    const schema = Validator.object();
    assert.equal(schema.getSchemaType(), 'object');
});

it('should create array schema', () => {
    const schema = Validator.array();
    assert.equal(schema.getSchemaType(), 'array');
});

it('should create number schema', () => {
    const schema = Validator.number();
    assert.equal(schema.getSchemaType(), 'number');
});

it('should throw error on undefined method call on schema', () => {
    const schema = Validator.schema();
    try {
        schema.unexistingMethod();
        assert.fail('Should thrown an error');
    } catch (error) {
        assert.equal(error.message, 'Schema method/property unexistingMethod doesn\'t exist');
    }
});
