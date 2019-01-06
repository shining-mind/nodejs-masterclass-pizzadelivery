const fs = require('fs');
const { resolve } = require('path');
const { promisify } = require('util');
const Collection = require('./Collection');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const openFile = promisify(fs.open);
const closeFile = promisify(fs.close);
const unlinkFile = promisify(fs.unlink);
const statFile = promisify(fs.stat);

class Storage {
    constructor(path) {
        this.basePath = path;
        this.extension = 'json';
    }

    /**
     * @param {String} name
     * 
     * @returns {Collection}
     */
    collection(name) {
        if (this._collections[name] === undefined) {
            this._collections[name] = new Collection(this, name);
        }
        return this._collections[name];
    }

    set basePath(path) {
        const stat = fs.statSync(path);
        if (!stat.isDirectory()) {
            throw new Error(`Path ${path} expected to be directory`);
        }
        this._basePath = path;
        this._collections = {};
    }

    get basePath() {
        return this._basePath;
    }

    create(path, data = {}) {
        return writeFile(this._getFullPath(path), JSON.stringify(data), {
            flag: 'wx'
        });
    }

    read(path) {
        return readFile(this._getFullPath(path)).then(JSON.parse);
    }

    async update(path, data) {
        const fd = await openFile(this._getFullPath(path), 'r+');
        const original = JSON.parse(await readFile(fd));
        // TODO: clone deep
        let modified = { ...original };
        Object.keys(data).forEach((key) => {
            modified[key] = data[key];
        });
        await writeFile(fd, JSON.stringify(modified));
        await closeFile(fd);
        return { original, modified };
    }

    delete(path) {
        return unlinkFile(this._getFullPath(path));
    }

    exists(path) {
        return statFile(this._getFullPath(path)).then((stats) => {
            return stats.isFile()
        }).catch((error) => {
            if (error.code === 'ENOENT') {
                return false;
            }
            return Promise.reject(error);
        });
    }

    _getFullPath(path) {
        return resolve(this.basePath, `${path}.${this.extension}`);
    }
}


module.exports = Storage;
