import { Request, Response, Router } from 'express';
import { Task } from './task';

const taskRouter = Router();
taskRouter.get('/', getAllTasks);

async function getAllTasks(_req: Request, res: Response) {
  const tasks = await Task.find();
  res.json(tasks);
}

export { taskRouter };
