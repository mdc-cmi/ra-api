"use strict"

const AuthenticationService = require("app/services/authentication-service")
const DeliveryService         = require("app/services/delivery-service")
const MailerService            = require("app/services/mailer-service")
const StorageService               = require("app/services/storage-service")

module.exports = async (application, redisInitializer) => {
  const logger = application.logger.child("services")
  const config = application.config
  const createRedisClient = () => redisInitializer.createClient(application)

  let services = {
    stop,
    start
  }
  Object.assign(services, {
    authentication: new AuthenticationService(logger, config, {...application, services}),
    mailer:        new MailerService(logger, config, {...application, services}),
    delivery:      new DeliveryService(logger, config, {...application, services}),
    storage:       new StorageService(logger, config, {...application, services}),
  })
  return services

  async function stop() {
    return true
  }
  async function start() {
    return await Promise.all(
      Object.keys(services).map(async service => service.start && await service.start()))
  }
}
