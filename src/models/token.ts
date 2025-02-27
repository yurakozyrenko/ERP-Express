import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Token extends Model {
  declare id: number;
  declare userId: string;
  declare refreshToken: string;
  declare deviceId: string;
  declare expiresAt: Date;
}

Token.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
    deviceId: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: 'token', timestamps: false },
);

export default Token;
