"use strict"

const createLogger         = require("app/initializers/create-logger")
const createHealthzMonitor = require("app/initializers/create-healthz-monitor")
const createKoaRouter      = require("app/initializers/create-koa-router")
const createModels         = require("app/initializers/create-models")
const createServices       = require("app/initializers/create-services")
const createCtxLogger      = require("app/initializers/create-ctx-logger")
const createCtxExtender    = require("app/initializers/create-ctx-extender")
const createKoaApp         = require("app/initializers/create-koa-app")
const createHttpServer     = require("app/initializers/create-http-server")
const createBgProcessing   = require("app/initializers/create-bg-processing")
const createRedisClient    = require("app/initializers/create-redis-client")
//const createGcloudStorage  = require("app/initializers/create-gcloud-storage")
//const createMapClient      = require("app/initializers/create-map-client")
//const createFirebaseAdmin  = require("app/initializers/create-firebase-admin")

class Application {
  constructor(config) {
    this.config = config
  }

  async initDependencies() {
    this.logger       = await createLogger(this)
    this.ctxLogger    = await createCtxLogger(this)
    this.koaRouter    = await createKoaRouter(this)
    this.models       = await createModels(this)
    this.redisClient  = await createRedisClient(this)
    this.jobs         = await createBgProcessing(this, createRedisClient)
    // this.googleStorage= await createGcloudStorage(this)
    // this.googleMaps   = await createMapClient(this)
    // this.firebaseAdmin= await createFirebaseAdmin(this)
    this.services     = await createServices(this, createRedisClient)
    this.ctxExtender  = await createCtxExtender(this)
    this.healthz      = await createHealthzMonitor(this)
    this.koaApp       = await createKoaApp(this)
    this.httpServer   = await createHttpServer(this)
  }

  async start() {
    this.logger.debug("Starting services...")
    await this.services.start()

    this.logger.debug("Starting healthz...")
    await this.healthz.start(this)

    this.logger.debug("Starting http server...")
    await this.httpServer.listen(this.config.http.port, this.config.http.host)
  }

  async stop() {
    this.logger.debug("Stopping healthz...")
    await this.healthz.stop()

    if (this.httpServer.listening) {
      this.logger.debug("Stopping http server...")
      await this.httpServer.stop()
    }

    this.logger.debug("Stopping background processing...")
    await this.jobs.stop()

    this.logger.debug("Stopping the services...")
    await this.services.stop()

    this.logger.debug("Closing the database connection...")
    await this.models.destroy()

    this.logger.info("App gracefully terminated.")
  }
}

module.exports = Application
