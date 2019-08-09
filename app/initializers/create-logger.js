"use strict"

const Logger = require("dead-simple-logger")

module.exports = async (application) => {
  const {namespace = "APP", level} = application.config.logger
  let logger = new Logger(namespace)
  logger.setLevel(level)

  return logger
}
