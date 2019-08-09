"use strict"

const {ValidationError, EmptyResultError} = require("sequelize")

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    presetJsonBody(e)
    throw e
  }
}

function presetJsonBody(e) {
  if (!e.jsonBody) {
    e.jsonBody = {}
  }

  if (e instanceof ValidationError) {
    e.expose = true
    e.status = 422
    e.jsonBody.errors = e.errors
  } else if (e instanceof EmptyResultError) {
    e.expose = true
    e.status = 404
    e.message = e.message || "Resource not found"
  }
}
