"use strict"
const _                = require("lodash")
const {handlers}       = require("@iin-mdc/koa-utils/lib/rest")
const {extendCtx} = require("./lib/rest")
const {protectWith, checkAccess}    = require("./lib/access")

function serialize(user) {
  return ({
    id: user.id,
    email: user.email,
    name: user.name,
    userType: user.userType,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  })
}

async function usersFilter(ctx, next) {
  if(!checkAccess(ctx, "viewAllUsers")) {
    ctx.request.query["userType"] = ctx.state.user.userType
  }
  if(ctx.restAction === "edit" || ctx.restAction === "create")
    await protectWith("manageUsers")(ctx)
  return next()
}

module.exports = {
  middlewares: [
    usersFilter,
    extendCtx({serialize})
  ],
  show: handlers.show("User"),
  list: handlers.list("User"),
  update: handlers.update("User", async (ctx, user, args) => {
    let {role, name, email, password, passwordConfirm} = args
    if(!checkAccess(ctx, "updateRole")) {
      role = ctx.state.user.role
    }
    user.setAttributes(_.omitBy({role, name, email, password, passwordConfirm}, _.isUndefined))
    if(user.changed("password")) await user.resetTokens("restore")
    await user.save()
    return user
  }),
  create: handlers.create("User", async (ctx, user, args) => {
    let {role, name, email, password, passwordConfirm} = args
    const userType = ctx.state.user.userType
    if(!checkAccess(ctx, "updateRole")) {
      role = ctx.state.user.role
    }
    user.setAttributes(_.omitBy({userType, role, name, email, password, passwordConfirm}, _.isUndefined))
    await user.save()
    await ctx.services.mailer.sendUserRegisterEmail(user, await user.createLoginToken())
    return user
  }),
  destroy: handlers.destroy("User"),
  forgotPassword: async ctx => {
    let {username} = ctx.request.body
    let user = await ctx.models.User.findOne({where: {username: username}, rejectOnEmpty: true})
    await ctx.services.mailer.sendPasswordForgotEmail(user, await user.createRestoreToken())
    ctx.body = {
      ok: true
    }
  },
  loginAs : async ctx => {
    await protectWith("loginAs")(ctx)
    let user = await ctx.models.User.findOne({where: {id: ctx.params.id}, rejectOnEmpty: true})
    let token       = await user.createLoginToken()
    let permissions = await user.getPermissions()
    ctx.body = {
      token: token,
      profile: user.profile,
      permissions: permissions
    }
  }
}
