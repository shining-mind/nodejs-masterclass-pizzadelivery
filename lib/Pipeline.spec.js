'use strict';

const assert = require('assert');
const Pipeline = require('./Pipeline');

it('should execute destination call with empty pipelines', () => {
    const destination = (passable) => {
        passable += '.';
        return passable;
    };
    const result = new Pipeline()
        .send('')
        .through([])
        .then(destination);
    assert.equal(result, '.');
});

it('should execute sync pipeline in correct order', () => {
    const pipe1 = (passable, next) => {
        passable += '1';
        return next(passable);
    };
    const pipe2 = (passable, next) => {
        passable += '2';
        return next(passable);
    };
    const destination = (passable) => {
        passable += '.';
        return passable;
    };
    const result = new Pipeline()
        .send('')
        .through([pipe1, pipe2])
        .then(destination);
    assert.equal(result, '12.');
});

it('should execute async pipeline in correct order', async () => {
    const pipe1 = (passable, next) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                passable += '1';
                resolve(next(passable));
            }, 10);
        });
    };
    const pipe2 = (passable, next) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                passable += '2';
                resolve(next(passable));
            }, 5);
        });
    };
    const destination = (passable) => {
        passable += '.';
        return passable;
    };
    const result = await new Pipeline()
        .send('')
        .through([pipe1, pipe2])
        .then(destination);
    assert.equal(result, '12.');
});

it('should execute async pipeline in correct order with pipe which waits for final result', async () => {
    const pipe1 = (passable, next) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                passable += '1';
                resolve(next(passable));
            }, 10);
        });
    };
    const pipe2 = (passable, next) => {
        return new Promise((resolve) => {
            setTimeout(async () => {
                passable += '2';
                let result = await next(passable);
                result += '-2';
                resolve(result);
            }, 5);
        });
    };
    const pipe3 = (passable, next) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                passable += '3';
                resolve(next(passable));
            }, 5);
        });
    };
    const destination = (passable) => {
        passable += '.';
        return passable;
    };
    const result = await new Pipeline()
        .send('')
        .through([pipe1, pipe2, pipe3])
        .then(destination);
    assert.equal(result, '123.-2');
});

it('should execute async pipeline in correct order with two pipes which waits for final result', async () => {
    const pipe1 = (passable, next) => {
        return new Promise((resolve) => {
            setTimeout(async () => {
                passable += '1';
                let result = await next(passable);
                result += '-1';
                resolve(result);
            }, 10);
        });
    };
    const pipe2 = (passable, next) => {
        return new Promise((resolve) => {
            setTimeout(async () => {
                passable += '2';
                let result = await next(passable);
                result += '-2';
                resolve(result);
            }, 5);
        });
    };
    const pipe3 = (passable, next) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                passable += '3';
                resolve(next(passable));
            }, 5);
        });
    };
    const destination = (passable) => {
        passable += '.';
        return passable;
    };
    const result = await new Pipeline()
        .send('')
        .through([pipe1, pipe2, pipe3])
        .then(destination);
    assert.equal(result, '123.-2-1');
});