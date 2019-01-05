const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);
const unlink = promisify(fs.unlink);

class Collection {
    constructor(storage, collectionName) {
        this.storage = storage;
        this.collectionName = collectionName;
        this._createCollection();
    }

    _createCollection() {
        const collectionPath = path.join(this.storage.basePath, this.collectionName);
        try {
            const stats = fs.statSync(collectionPath);
            if (stats.isFile()) {
                throw new Error(`Collection '${this.collectionName}' already exists as file`);
            }
            if (!stats.isDirectory()) {
                fs.mkdirSync(collectionPath);
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                fs.mkdirSync(collectionPath);
                return;
            }
            throw error;
        }
    }

    create(entity, data) {
        return this.storage.create(this._getEntityPath(entity), data);
    }

    read(entity) {
        return this.storage.read(this._getEntityPath(entity));
    }

    update(entity, data) {
        return this.storage.update(this._getEntityPath(entity), data);
    }

    delete(entity) {
        return this.storage.delete(this._getEntityPath(entity));
    }

    exists(entity) {
        return this.storage.exists(this._getEntityPath(entity));
    }

    async drop() {
        const collectionPath = path.join(this.storage.basePath, this.collectionName);
        const entities = await readdir(collectionPath);
        const promises = entities.map(entity => unlink(path.join(collectionPath, entity)));
        await Promise.all(promises);
        await rmdir(collectionPath);
    }

    _getEntityPath(entity) {
        return path.join(this.collectionName, entity);
    }
}

module.exports = Collection;