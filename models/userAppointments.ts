import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import db from './db'
import dayjs from '../utils/dayjs'

class UserAppointmentsModel extends Model<InferAttributes<UserAppointmentsModel>, InferCreationAttributes<UserAppointmentsModel>> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare appointment_id: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

UserAppointmentsModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  appointment_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: dayjs(),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: dayjs(),
  },
}, { underscored: true, tableName: 'UserAppointments', sequelize: db })

export default UserAppointmentsModel
