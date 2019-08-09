"use strict"
const {intersection} = require("lodash")
const {ForbiddenError}      = require("app/services/authentication-service")
async function checkAccess(ctx, ...required) {
  return intersection(ctx.state.permissions, required).length > 0
}

module.exports = {
  checkAccess: checkAccess,
  protectWith: (...required) => async (ctx, next) => {
    if(!await checkAccess(ctx, ...required)) {
      throw new ForbiddenError("Forbidden")
    } else {
      if(next)
        await next()
    }
  }
}
