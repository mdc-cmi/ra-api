"use strict"
const Router        = require("koa-router")
const handlers = {
   users:         require("app/handlers/users"),
   auth:          require("app/handlers/authentication"),
   errors:        require("app/handlers/http-errors"),
}

const rest = {
  for: (path, router, handlers) => {
    const {list, show, create, update, destroy} = handlers
    let middlewares = handlers.middlewares || []
    let action = (name) => (ctx, next) => {
      ctx.state.restAction = name
      return next()
    }

    if(list)   router.get(path, action("list"), ...middlewares, list)
    if(show)   router.get(`${path}/:id`, action("show"), ...middlewares, show)
    if(update) router.patch(`${path}/:id`, action("update"), ...middlewares, update)
    if(create) router.post(path, action("create"), ...middlewares, create)
    if(destroy) router.delete(`${path}/:id`, action("destroy"), ...middlewares, destroy)
  }
}


module.exports = async () => {
  const router = Router()
  router.use(handlers.errors)

  extend("/api/management", router => {
    router.post("/authenticate", handlers.auth.login)
    router.post("/restore-password", handlers.users.forgotPassword)

    router.use(handlers.auth.token)
    router.post("/users/:id/authenticate", handlers.users.loginAs)
    rest.for("/users", router, handlers.users)
    return router
  }, router)

  return router
}

function extend(path, fn, parent) {
  let router = fn(Router())
  parent.use(path, router.routes())
  return parent
}
