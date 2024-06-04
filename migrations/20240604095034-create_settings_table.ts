import { DataTypes, Sequelize, QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('Settings', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      key: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        // @ts-ignore
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        // @ts-ignore
        defaultValue: Sequelize.NOW,
      },
    }, { transaction })
  }),

  down: async (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('Settings', { transaction })
  }),
}
