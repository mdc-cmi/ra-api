"use strict"

module.exports = {
  token: async (ctx, next) => {
    let authentication = ctx.services.authentication
    let authToken      = ctx.authToken
    let user           = await authentication.authorize(authToken, ctx.models.User)
    ctx.state.user     = user
    ctx.state.permissions = await user.getPermissions()
    await next()
  },
  login: async(ctx) => {
    let {username, password, token} = ctx.request.body
    let authentication = ctx.services.authentication
    let user = null
    if(token) {
      user  = await authentication.authorize(token, ctx.models.User)
    } else {
      [user, token] = await authentication.login(username, password)
    }
    const permissions = await user.getPermissions()
    ctx.body = {
      token: token,
      profile: {
        ...user.profile,
        permissions
      }      
    }
  }
}
