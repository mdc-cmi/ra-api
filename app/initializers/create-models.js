"use strict"

const path              = require("path")
const ModelsInitializer = require("@iin-mdc/koa-utils/initializers/models-initializer")
const Sequelize         = require("sequelize")

module.exports = async (application) => {
  const logger = application.logger.child("models")
  const {modelsDir, uri, options = {}} = application.config.database
  const models = new ModelsInitializer(logger, uri, Sequelize, {
    modelsDir:        path.join(__dirname, "../.." , modelsDir),
    sequelizeOptions: options
  })
  await models.initializeModels()
  return models
}
