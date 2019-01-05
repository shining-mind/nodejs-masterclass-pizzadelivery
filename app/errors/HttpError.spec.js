const assert = require('assert');
const HttpError = require('./HttpError');

it('should have default message', () => {
    assert.equal(new HttpError().message, 'Internal Server Error');
});

it('should have custom message', () => {
    assert.equal(new HttpError('Custom').message, 'Custom');
});
