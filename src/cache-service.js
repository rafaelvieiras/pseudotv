const path = require('path');
const fs = require('fs');
const config = require('./config');

/**
 * A File Cache controller for store and retrieve files from disk
 *
 * @class CacheService
 */
class CacheService {
    constructor() {
        this.cachePath = path.join(config.DATABASE, 'cache');
        this.cache = {};
    }

    /**
     * `save` a file on cache folder
     *
     * @param {string} fullFilePath
     * @param {*} data
     * @returns {promise}
     * @memberof CacheService
     */
    setCache(fullFilePath, data) {
        return new Promise((resolve, reject) => {
            try {
                const file = fs.createWriteStream(path.join(this.cachePath, fullFilePath));
                file.write(data, (err) => {
                    if(err) {
                        throw Error("Can't save file: ", err);
                    } else {
                        this.cache[fullFilePath] = data;
                        resolve(true);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * `get` a File from cache folder
     *
     * @param {string} fullFilePath
     * @returns {promise} `Resolve` with file content, `Reject` with false
     * @memberof CacheService
     */
    getCache(fullFilePath) {
        return new Promise((resolve, reject) => {
            try {
                if(fullFilePath in this.cache) {
                    resolve(this.cache[fullFilePath]);
                } else {
                    fs.readFile(path.join(this.cachePath, fullFilePath), 'utf8', function (err,data) {
                        if (err) {
                          resolve(false);
                        }
                        resolve(data);
                    });
                }
            } catch (error) {
                resolve(false);
                throw Error("Can't get file", error)
            }
        });
    }

    /**
     * `delete` a File from cache folder
     *
     * @param {string} fullFilePath
     * @returns {promise}
     * @memberof CacheService
     */
    deleteCache(fullFilePath) {
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync(path.join(this.cachePath, fullFilePath), (err) => {
                    if(err) {
                        throw Error("Can't save file: ", err);
                    } else {
                        delete this.cache[fullFilePath];
                        resolve(true);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = new CacheService();