"use strict"
const Koa         = require("koa")
const cors        = require("@koa/cors")
const bodyParser  = require("koa-bodyparser")
const parse       = require("co-busboy")
const fs          = require("fs-extra")
const tmp         = require("tmp-promise")
module.exports = async (application) => {
  const {koaRouter, ctxLogger, ctxExtender, healthz} = application
  const app = new Koa()

  app.use(ctxLogger)
  app.use(healthz.middleware)
  app.use(cors())

  app.use((async function (ctx, next) {
    // the body isn't multipart, so busboy can't parse it
    if (!ctx.request.is("multipart/*")) return await next()

    ctx.disableBodyParser = true

    const parts = parse(ctx, {autoFields:true})
    const body = parts.field || {}
    var part
    while ((part = await parts()) != null) {
      const tmpFileName = await tmp.tmpName()
      const stream = fs.createWriteStream(tmpFileName)
      part.pipe(stream)
      body[part.fieldname] = {
        fieldname: part.fieldname,
        filename: part.filename,
        mime: part.mime,
        mimeType: part.mimeType,
        tmpFileName: tmpFileName
      }
      ctx.res.once("finish", () => fs.unlink(tmpFileName))
    }
    ctx.request.body = body
    return await next()
  }))

  app.use(bodyParser())
  app.use(ctxExtender)
  // app.use(koaRouter.routes())
  // app.use(koaRouter.allowedMethods())

  return app
}
