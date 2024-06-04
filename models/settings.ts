import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import db from './db'
import dayjs from '../utils/dayjs'

class SettingsModel extends Model<InferAttributes<SettingsModel>, InferCreationAttributes<SettingsModel>> {
  declare id: CreationOptional<string>;
  declare key: string;
  declare value: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

SettingsModel.init({
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
    defaultValue: dayjs(),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: dayjs(),
  },
}, { underscored: true, tableName: 'Settings', sequelize: db })

export default SettingsModel
