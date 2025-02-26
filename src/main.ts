import "reflect-metadata";
import express from "express";
import "dotenv/config";
// import AppDataSource from './config/db';
import cors from "cors";
import db from "./models";
// import router from './routes/index';
// import errorHandler from './middleware/ErrorHandlingMiddleware';
// import swaggerDocs from './config/swagger';
// import swaggerUi from 'swagger-ui-express';

const app = express();
const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 3000;

app.use(cors());
app.use(express.json());
// app.use('/api', router);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app.use(errorHandler);

// Запуск сервера
db.sequelize.sync().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`🚀 Server is running on port ${HTTP_PORT}`);
  });
});

// export default app;
