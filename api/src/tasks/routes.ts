import { classToPlain } from 'class-transformer';
import { Request, Response, Router } from 'express';
import { CreateTaskDto } from '../dto';
import { HttpResponseCode } from '../errors/error-types';
import { NotFoundError } from '../errors/errors';
import { Task } from './task';

const taskRouter = Router();
taskRouter.get('/', getAllTasks);
taskRouter.post('/', createTask);
taskRouter.get('/:id', getTask);
taskRouter.delete('/:id', deleteTask);

async function getAllTasks(req: Request, res: Response) {
  const tasks = await Task.find({ userId: req.userId });
  res.json(classToPlain(tasks));
}

async function getTask(req: Request<{ id: string }, {}, {}>, res: Response) {
  const task = await Task.findOne({ id: req.params.id, userId: req.userId });
  if (!task) {
    throw new NotFoundError();
  }
  res.json(classToPlain(task));
}

async function createTask(req: Request<{}, {}, CreateTaskDto>, res: Response) {
  const task = Task.create({ ...req.body, userId: req.userId });
  await task.save();
  res.json(classToPlain(task));
}

async function deleteTask(req: Request<{ id: string }, {}, {}>, res: Response) {
  const result = await Task.delete({ id: req.params.id, userId: req.userId });
  if (!result.affected || result.affected === 0) {
    throw new NotFoundError();
  }
  res.sendStatus(HttpResponseCode.NO_CONTENT);
}

export { taskRouter };
