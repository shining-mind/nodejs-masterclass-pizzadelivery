const assert = require('assert');
const InternalServerError = require('./InternalServerError');

it('should have default message', () => {
    assert.equal(new InternalServerError().message, 'Internal Server Error');
});

it('should have custom message', () => {
    assert.equal(new InternalServerError('Custom').message, 'Custom');
});
