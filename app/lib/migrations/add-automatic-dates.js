"use strict"

const DEFINITIONS = {
  createdAt: "datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
  updatedAt: "datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)"
}

module.exports = async function makeDatesAutomatic(queryInterface, tableName) {
  for (let columnName in DEFINITIONS) {
    let result = await queryInterface.sequelize.query(`SHOW COLUMNS FROM \`${tableName}\` LIKE '${columnName}'`)
    if (result[0].length) {
      // eslint-disable-next-line no-console
      console.log(`   > Updating column \`${columnName}\` in table \`${tableName}\`...`)
      await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` MODIFY \`${columnName}\` ${DEFINITIONS[columnName]}`)
    }
  }
  return true
}
