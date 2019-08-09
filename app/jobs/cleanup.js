"use strict"

module.exports = async (ctx, {data}) => {
  ctx.logger.debug("======================== authentication.cleanup job started ====================")
  await ctx.services.authentication.cleanup(data).catch(error => ctx.logger.error(error))
  ctx.logger.debug("======================== authentication.cleanup job done    ====================")
  return true
}
