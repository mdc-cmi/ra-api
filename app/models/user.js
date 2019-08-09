"use strict"
const bcrypt      = require("@iin-mdc/koa-utils/lib/bcrypt-setup")
const permissions = require("app/lib/permissions")
const {get}       = require("lodash")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userType: DataTypes.STRING, //mdc/distributor/client
    role: DataTypes.STRING,     //admin/admin/client manager/site manager
    passwordConfirm:   DataTypes.VIRTUAL,
    password:          DataTypes.VIRTUAL,
    encryptedPassword: DataTypes.STRING,
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING },
    name: DataTypes.STRING,
    locale: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get: function() { return "pt-BR" }
    },
    profile: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ["id", "name", "username", "email", "userType", "role"]),
      get: function() {
        return ({
          id: this.id,
          name: this.name,
          username: this.username,
          email: this.email,
          userType: this.userType,
          role: this.role,
        })
      }
    }
  }, {
    validate: {
      passwordConfirmValidate: function() {
        if(this.password && this.passwordConfirm != this.password) {
          throw new Error("password confirmation should match password")
        }
      }
    }
  })
  User.prototype.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.encryptedPassword)
    } catch (e) {
      return false
    }
  }
  User.beforeSave(async (self) => {
    if(self.password) {
      self.encryptedPassword = await bcrypt.hash(self.password, 10)
    }
  })
  User.prototype.getPermissions = async function () {
    return get(permissions, `${this.userType}.${this.role}`, [])
  }
  // User.associate = function(models) {
  //
  // }
  return User
}
