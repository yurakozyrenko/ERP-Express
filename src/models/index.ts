import sequelize from '../config/db';
import File from './file';
import Token from './token';
import User from './user';

User.hasMany(File, { foreignKey: 'userId', as: 'files', onDelete: 'CASCADE' });
File.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

User.hasMany(Token, { foreignKey: 'userId', as: 'tokens', onDelete: 'CASCADE' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

const db = {
  sequelize,
  User,
  File,
  Token
};

export default db;
