import { DataTypes, QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('Appointments', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      available_slots: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      time: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, { transaction })

    await queryInterface.createTable('Users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, { transaction })

    await queryInterface.createTable('UserAppointments', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      appointment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Appointments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, { transaction })
  }),

  down: async (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('UserAppointments', { transaction })
    await queryInterface.dropTable('Users', { transaction })
    await queryInterface.dropTable('Appointments', { transaction })
  }),
}
