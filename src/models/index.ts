import sequelize from '../config/db';
import File from './file';
import User from './user';

// ✅ Определяем связи ПОСЛЕ загрузки моделей
User.hasMany(File, { foreignKey: 'userId', as: 'files', onDelete: 'CASCADE' });
File.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

const db = {
  sequelize,
  User,
  File,
};

export default db;
