import 'reflect-metadata';
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import db from './models';
import errorHandler from './middleware/ErrorHandlingMiddleware';
import router from './routes/index';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger';

const app = express();
const HTTP_PORT: number = Number(process.env.HTTP_PORT) || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/', router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);

db.sequelize.sync().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`🚀 Server is running on port ${HTTP_PORT}`);
  });
});
