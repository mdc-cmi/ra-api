"use strict"
const tmp         = require("tmp-promise")

class StorageService {
  constructor(logger, config, {models, googleStorage}) {
    this.logger = logger
    this.config = config
    this.models = models
    this.storage  = googleStorage
  }

  async upload(path, tmpFile, options = {}) {
    if(options.public) {
      options.acl = "all-users-read"
    }
    let [file] = await this.storage.upload(tmpFile, { destination: path, ...options})
    return file
  }
  async download(path) {
    const [files] = await this.storage.getFiles({prefix: path})
    if(files.length === 1) {
      const tmpFileName = await tmp.tmpName()
      await files[0].download({destination: tmpFileName})
      return tmpFileName
    }
    return null
  }
  async delete(path) {
    const [files] = await this.storage.getFiles({prefix: path})
    if(files.length === 1) {
      await files[0].delete()
    }
  }
}

module.exports = StorageService
