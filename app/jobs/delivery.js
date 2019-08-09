"use strict"

module.exports = async (ctx, {data}) => {
  ctx.logger.debug("======================== delivery job started ====================")
  await ctx.services.delivery.process(data).catch(error => ctx.logger.error(error))
  ctx.logger.debug("======================== delivery job done    ====================")
  return true
}
