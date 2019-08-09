"use strict"
const bcrypt    = require("@iin-mdc/koa-utils/lib/bcrypt-setup")
const uuid             = require("uuid/v4")
const LOGIN_EXPIRES_IN   = 14 * 86400 * 1000
const RESTORE_EXPIRES_IN = 1 * 86400 * 1000

module.exports = (sequelize, DataTypes) => {
  const AuthToken = sequelize.define("AuthToken", {
    tokenType: DataTypes.STRING,
    token:          DataTypes.VIRTUAL,
    encryptedToken: DataTypes.STRING,
    target: DataTypes.STRING,
    targetId: DataTypes.INTEGER,
    expiredAt: DataTypes.DATE,
    authToken: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ["token", "id"]),
      get: function() {
        if(this.token && this.id) {
          return `${this.token};${this.id}`
        }
        return null
      }
    }
  }, {

  })
  AuthToken.beforeSave(async (self) => {
    switch(self.tokenType) {
      case "login":
        self.expiredAt = new Date((new Date()).valueOf() + LOGIN_EXPIRES_IN)
        break
      case "restore":
        self.expiredAt = self.expiredAt || new Date((new Date()).valueOf() + RESTORE_EXPIRES_IN)
        break
      default:
        self.expiredAt = new Date()
        break
    }
  })
  AuthToken.beforeValidate(async (self) => {
    if(!self.encryptedToken) {
      self.token = uuid()
    }
  })

  AuthToken.prototype.getTarget = async function() {
    return await AuthToken.associations[this.target].get(this)
  }

  AuthToken.addLogin = (model) => {
    AuthToken.belongsTo(model, {
      foreignKey: "targetId",
      as: model.name
    })
    model.hasMany(AuthToken, {
      foreignKey: "targetId",
      scope: { target: model.name }
    })
    model.prototype.createLoginToken = async function(options = {}) {
      let token = await this.createAuthToken({tokenType: "login"}, options)
      return token.authToken
    }

    model.prototype.createRestoreToken = async function(options = {}) {
      let token = await this.createAuthToken({tokenType: "restore"}, options)
      return token.authToken
    }
    model.prototype.resetTokens = async function(tokenType = null, options) {
      return await AuthToken.destroy({where: {
        target: model.name,
        targetId: this.id,
        tokenType: tokenType || ["login", "restore"]
      }}, options)
    }
  }

  AuthToken.associate = function(models) {
    AuthToken.addLogin(models.User)    
  }
  bcrypt.addBcryptCheck(AuthToken)
  return AuthToken
}
