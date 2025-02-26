import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class File extends Model {
  declare id: number;
  declare name: string;
  declare extension: string;
  declare mimeType: string;
  declare size: number;
  declare uploadDate: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: false,
  },
);

export default File;
