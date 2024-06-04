import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import db from './db'
import dayjs from '../utils/dayjs'

class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<string>;
  declare first_name: string;
  declare last_name: string;
  declare password: string;
  declare username: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

UserModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
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
}, { underscored: true, tableName: 'Users', sequelize: db })

export default UserModel
