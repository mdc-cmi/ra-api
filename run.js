"use strict"

const Runner      = require("@iin-mdc/koa-utils/lib/runner")
const Application = require("./index")
const config      = require("./config")

const runner = new Runner(Application, {
  config,
  stopSignals: [
    "SIGUSR2",
    "SIGTERM"
  ]
})

runner.start()
