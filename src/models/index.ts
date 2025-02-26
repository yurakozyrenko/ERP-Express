import sequelize from "../config/db";
import File from "./file";
import User from "./user";

const db = {
  sequelize,
  User,
  File,
};

export default db
