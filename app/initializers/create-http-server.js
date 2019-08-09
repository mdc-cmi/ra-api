"use strict"

const createServer = require("@iin-mdc/koa-utils/initializers/http-server")

module.exports = async (application) => {
  const logger = application.logger.child("httpServer")
  return await createServer(logger, application.koaApp.callback(), {})
}
