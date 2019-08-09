'use strict';
const bcrypt    = require("@iin-mdc/koa-utils/lib/bcrypt-setup")

module.exports = {
  up: async function (queryInterface, Sequelize) {
   let pwd = await bcrypt.hash("123qwe", 10)
   return queryInterface.bulkInsert('Users', [ {
        id:    1,
        userType: "admin",
        role: "admin",
        email: "mdc-cmi@rebbix.com",
        encryptedPassword: pwd,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
