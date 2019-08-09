"use strict"

const Runner      = require("@iin-mdc/koa-utils/lib/runner")
const Application = require("./index")
const config      = require("./config")

class JobsApplication extends Application {
  async start() {
    this.logger.debug("Starting healthz...")
    await this.healthz.start()

    this.logger.debug("Waiting for health check success...")
    await this.healthz.whenOk()

    this.logger.debug("Starting background processing...")
    await this.jobs.start()
  }
}

const runner = new Runner(JobsApplication, {
  config,
  stopSignals: [
    "SIGINT",
    "SIGUSR2",
    "SIGTERM"
  ]
})

runner.start()
