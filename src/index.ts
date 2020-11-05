import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import config from './config';
import { scheduleTasks } from './scheduler';
import { taskRouter } from './tasks/routes';
import { connectDatabase } from './database';

async function startApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(json());

  await connectDatabase();
  const scheduledTasks = await scheduleTasks();

  const v1 = express.Router();
  v1.use('/tasks', taskRouter);
  app.use('/api/v1', v1);

  const port = config.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
}

startApp();
