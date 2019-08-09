"use strict"
class AuthenticationService {
  constructor(logger, config, {models}) {
    this.logger = logger
    this.config = config
    this.models = models
  }
  async find(rawToken) {
    const {AuthToken} = this.models
    let match = rawToken.match(/^(?:Token\s*)?([^;]+);(\d+)$/)
    if (!match) {
      throw new AuthenticationError("Auth token format invalid")
    }
    let [, token, id] = match
    let instance = await AuthToken.findOne({where: {id}})
    let isValid  = instance ? await instance.isValidToken(token) : undefined
    return [instance, isValid]
  }
  async authorize(rawToken, model) {
    if(rawToken) {
      const [instance, isValid] = await this.find(rawToken)
      if(instance && isValid && instance.target === model.name) {
        await instance.save() //propagate expire
        let target = await instance.getTarget()
        if(!target) {
          await instance.destroy()
          throw new AuthenticationError("Unauthorized")
        }
        return target
      } else {
        throw new AuthenticationError("Unauthorized")
      }
    } else {
      throw new AuthenticationError("Requires Authorization token")
    }
  }

  async login(username, password) {
    const {User} = this.models
    let account = await User.findOne({where: {username}})
    if (!account || !await account.isValidPassword(password)) throw new AuthenticationError("Authorization failed")

    let token = await account.createLoginToken()
    return [account, token]
  }


  async cleanup() {
    const {AuthToken, MobileAlertPanel, Sequelize: {Op}} = this.models
    await AuthToken.destroy({where: {targetId: null}})
    await AuthToken.destroy({where: {expiredAt: {[Op.lt]: new Date()}}} )
  }
}


class AuthenticationError extends Error {
  constructor(...args) {
    super(...args)
    this.expose = true
    this.status = 401
  }
}
class ForbiddenError extends Error {
  constructor(...args) {
    super(...args)
    this.expose = true
    this.status = 403
  }
}

AuthenticationService.AuthenticationError = AuthenticationError
AuthenticationService.ForbiddenError = ForbiddenError
module.exports = AuthenticationService
