"use strict"

const Redis = require("ioredis")

function createClient(application) {
  const redisUrl    = application.config.redis.uri
  const redisClient = new Redis(redisUrl, {
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000)
    }
  })

  return redisClient
}

module.exports = async (application) => {
  return createClient(application)
}

module.exports.createClient = createClient
