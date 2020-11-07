import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import 'express-async-errors';
import config from './config';
import { scheduleTasks } from './scheduler';
import { taskRouter } from './tasks/routes';
import { connectDatabase } from './database';
import { initFirebase } from './auth/firebase';
import { requireAuth } from './auth/require-auth';
import { errorHandler } from './errors/error-handler';

async function startApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(json());

  await connectDatabase();
  initFirebase();
  await scheduleTasks();

  app.use(requireAuth);

  const v1 = express.Router();
  v1.use('/tasks', taskRouter);
  app.use('/api/v1', v1);

  app.use(errorHandler);
  const port = config.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
}

startApp();
