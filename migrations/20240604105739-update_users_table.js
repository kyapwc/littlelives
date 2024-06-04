const { DataTypes, Sequelize } = require('sequelize')

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn('Users', 'password', {
      type: DataTypes.STRING,
      allowNull: false,
    }, { transaction })
    await queryInterface.addColumn('Users', 'username', {
      type: DataTypes.STRING,
      allowNull: false,
    }, { transaction })
  }),

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('Users', 'password', { transaction })
    await queryInterface.removeColumn('Users', 'username', { transaction })
  }),
}
