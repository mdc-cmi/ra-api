"use strict"

const Healthz = require("@iin-mdc/koa-utils/lib/healthz")

module.exports = async (application) => {
  const logger          = application.logger.child("healthz-monitor")
  const healthzOptions = application.config.healthzOptions

  const healthz = new Healthz(logger, application, healthzOptions)
  healthz.registerWatcher("database", async function (logger, app) {
    this.modelsAvailable = this.modelsAvailable || (await app.models.sequelize.query("show tables")).length > 1
    return this.modelsAvailable
  }, {required: true})

  healthz.registerWatcher("redis", async function (logger, app) {
    return app.redisClient.status === "ready"
  }, {required: true})

  return healthz
}
