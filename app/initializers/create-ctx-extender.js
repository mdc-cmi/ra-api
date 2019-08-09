"use strict"

const createCtxExtender = require("@iin-mdc/koa-utils/middleware/ctx-extender")

module.exports = async (application) => {
  return createCtxExtender({
    models: application.models,
    services: application.services,
    jobs: application.jobs
  })
}
