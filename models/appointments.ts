import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import db from './db'
import dayjs from '../utils/dayjs'

class AppointmentModel extends Model<InferAttributes<AppointmentModel>, InferCreationAttributes<AppointmentModel>> {
  declare id: CreationOptional<string>;
  declare date: string;
  declare available_slots: number;
  declare time: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

AppointmentModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: dayjs().format('YYYY-MM-DD'),
  },
  available_slots: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '09:00',
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
}, { underscored: true, tableName: 'Appointments', sequelize: db })

export default AppointmentModel
