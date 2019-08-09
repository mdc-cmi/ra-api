"use strict"

const createCtxLogger = require("@iin-mdc/koa-utils/middleware/ctx-logger")

module.exports = async (application) => {
  return createCtxLogger(application.logger, application.config.gcloudReporting, fetchUser)
}

async function fetchUser(ctx) {
  let user = null
  if (ctx.state && (ctx.state.user || ctx.state.map)) {
    if(ctx.state.user)
      user = `User#${ctx.state.user.id}`
    else
      user = `MAP#${ctx.state.map.id}`
  }
  return user
}
