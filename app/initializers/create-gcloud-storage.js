"use strict"
const {Storage} = require("@google-cloud/storage")

module.exports = async (application) => {
  const storageOptions = application.config.gcloudStorage

  let gcloudStorageOptions = {}
  if (storageOptions.projectId)   gcloudStorageOptions.projectId   = storageOptions.projectId
  if (storageOptions.credentials) gcloudStorageOptions.credentials = storageOptions.credentials
  const storage = new Storage(gcloudStorageOptions)
  return storage.bucket(storageOptions.bucket)
}
