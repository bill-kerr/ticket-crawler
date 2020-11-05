import { Request, Response, Router } from 'express';

const taskRouter = Router();
taskRouter.get('/', getAllTasks);

async function getAllTasks(_req: Request, res: Response) {
  res.json({ message: 'this works' });
}

export { taskRouter };
