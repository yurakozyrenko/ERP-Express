import sequelize from '../config/db';
import File from './file';
import Token from './token';
import User from './user';

// ✅ Определяем связи ПОСЛЕ загрузки моделей
User.hasMany(File, { foreignKey: 'userId', as: 'files', onDelete: 'CASCADE' });
File.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// ✅ Определяем связи ПОСЛЕ загрузки моделей
User.hasMany(Token, { foreignKey: 'userId', as: 'tokens', onDelete: 'CASCADE' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

const db = {
  sequelize,
  User,
  File,
  Token
};

export default db;
