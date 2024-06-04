import { DataTypes, QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn('Users', 'password', {
      type: DataTypes.STRING,
      allowNull: false,
    }, { transaction })
    await queryInterface.addColumn('Users', 'username', {
      type: DataTypes.STRING,
      allowNull: false,
    }, { transaction })
  }),
  down: async (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('Users', 'password', { transaction })
    await queryInterface.removeColumn('Users', 'username', { transaction })
  }),
}
