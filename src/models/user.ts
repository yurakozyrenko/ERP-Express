import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {
  declare id: string; // id может быть телефоном или email
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);

export default User;
