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

it('should create collection entity', async () => {
    const expectedEntity = storage.basePath + '/bugs/1.json';
    await storage.collection('bugs').create('1', { test: true });
    const stats = statSync(expectedEntity);
    assert(stats.isFile(), 'Should be file');
});

it('should fail to create same collection entity', async () => {
    try {
        await storage.collection('bugs').create('1', { test: true });
        assert.fail('Should have failed');
    } catch (error) {
        assert(error.code === 'EEXIST');
    }
});

it('should read created collection entity', async () => {
    const data = await storage.collection('bugs').read('1');
    assert.deepEqual(data, { test: true });
});

it('should drop collection', async () => {
    await storage.collection('bugs').create('2');
    await storage.collection('bugs').create('3');
    await storage.collection('bugs').drop();
    try {
        statSync(storage.basePath + '/bugs');
        assert.fail('Expected to drop collection');
    } catch (error) {
        assert(error.code === 'ENOENT');
    }
});
