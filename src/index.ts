import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import config from './config';
import { scheduleTasks } from './tasks';

async function startApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(json());

  app.get('/', (_req, res) => res.json({ message: 'hello_world' }));

  await scheduleTasks();

  const port = config.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
}

startApp();
