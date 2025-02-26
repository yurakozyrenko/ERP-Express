import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class TokenBlacklist extends Model {
  declare token: string;
}

TokenBlacklist.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'token_blacklist',
    timestamps: true, // Запоминаем, когда токен был добавлен в чёрный список
  }
);

export default TokenBlacklist;
