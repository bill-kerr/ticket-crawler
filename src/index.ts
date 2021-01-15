import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import config from './config';
import { connectDatabase } from './database';
import { createTasks, scheduleTask } from './tasks';

async function startApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(json());

  try {
    await connectDatabase();
    console.log('Connected to database.');
  } catch (error) {
    console.error(error);
  }

  const tasks = createTasks();
  tasks.forEach(task => scheduleTask(task));

  const port = config.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
}

startApp();
