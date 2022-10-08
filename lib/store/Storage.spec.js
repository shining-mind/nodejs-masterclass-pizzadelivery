'use strict';

const assert = require('assert');
const { resolve } = require('path');
const { mkdirSync, rmdirSync, statSync, unlinkSync, readdirSync } = require('fs');
const Storage = require('./Storage');

const pathName = resolve(__dirname, 'test');
let storage;
before(() => {
    mkdirSync(pathName);
    storage = new Storage(pathName);
});

after(() => {
    const files = readdirSync(pathName);
    files.forEach(file => unlinkSync(resolve(pathName, file)));
    rmdirSync(pathName);
})

it('should create file', async () => {
    const expectedFile = resolve(storage.basePath, '1.json');
    await storage.create('1', { test: true });
    const stats = statSync(expectedFile);
    assert(stats.isFile(), 'Should be file');
});

it('should return true on `exists` call for created file', async () => {
    assert(true === await storage.exists('1'));
});

it('should read created file', async () => {
    const data = await storage.read('1');
    assert.deepEqual(data, { test: true });
});

it('should update created file', async () => {
    const expected = { test: false, other: true };
    const original = await storage.read('1');
    const updateResult = await storage.update('1', expected);
    const data = await storage.read('1');
    assert.deepEqual(data, expected);
    assert.deepEqual(updateResult.modified, expected);
    assert.deepEqual(updateResult.original, original);

});

it('should delete created file', async () => {
    const expectedFile = resolve(storage.basePath, '1.json');
    await storage.delete('1');
    try {
        statSync(expectedFile);
        assert.fail('Expected to delete');
    } catch (error) {
        assert(error.code === 'ENOENT');
    }
});

it('should fail to update deleted file', async () => {
    const expected = { test: false, other: true };
    try {
        await storage.update('1', expected);
        assert.fail('Expected to fail');
    } catch (error) {
        assert(error.code === 'ENOENT');
    }
});

it('should return false on `exists` call for deleted file', async () => {
    assert(false === await storage.exists('1'));
});
