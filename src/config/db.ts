import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.DB_NAME ?? "file_service",
  process.env.DB_USER ?? "root",
  process.env.DB_PASS ?? "",
  {
    host: process.env.DB_HOST ?? "localhost",
    dialect: "mysql",
    logging: false,
  },
);

export default sequelize;