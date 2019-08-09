"use strict"
const deepMerge = require("@iin-mdc/koa-utils/lib/deep-merge-with-symbols")
const _         = require("lodash")

function extendQuery(query1, query2) {
  const {include: include1, ...rest1} = query1
  const {include: include2, ...rest2} = query2

  const query = deepMerge({}, rest1, rest2)
  query.include = (include1 || []).concat(include2 || []).reduce((res, include) => {
    let index = _.findIndex(res, item =>
        include.model === item.model ||
        (item.as && include.as && item.as === include.as))

    if(index >= 0) {
      res[index] = deepMerge({}, res[index], include)
      return res
    } else {
      return res.concat(include)
    }
  }, [])
  return query
}
module.exports = {
  extendQuery,
  extendCtx: options => (ctx, next) => {
    Object.assign(ctx, options)
    return next()
  }
}
