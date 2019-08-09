"use strict"
const Queue                   = require("bull")
const BgProcessingInitializer = require("@iin-mdc/koa-utils/initializers/bg-processing-initializer")

module.exports = async (application, redisInitializer) => {
  const logger            = application.logger.child("bg-processing")
  const createRedisClient = () => redisInitializer.createClient(application)

  const bgProcessing = new BgProcessingInitializer(logger, application, Queue, createRedisClient)
  await bgProcessing.initializeQueues({
    delivery:      [1, require("app/jobs/delivery")],
    cleanup:       [1, require("app/jobs/cleanup")],
  })

  await bgProcessing.initializeJobs(async (queues) => {
    await queues.delivery.add({}, {repeat: {name: "delivery", cron: "* * * * *"}})
    await queues.cleanup.add({}, {repeat: {name: "cleanup", cron: "0 0 * * *"}})    
  })

  return bgProcessing
}
