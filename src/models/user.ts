import sequelize from "../config/db";
const { DataTypes } = require("sequelize");


const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING, // email или номер телефона
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User
