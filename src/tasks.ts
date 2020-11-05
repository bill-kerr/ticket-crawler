import addDuration from 'date-fns/add';
import { CronJob } from 'cron';
import { Task } from './entities/task';

export function scheduleTask(task: Task) {
  const job = new CronJob(task.cronTime, buildTask(task), null, false, task.cronTimezone);
  job.start();
  return job;
}

export async function scheduleTasks() {
  const tasks = await Task.find();
  tasks.map(task => scheduleTask(task));
}

function buildTask(task: Task) {
  return function () {
    try {
      addDuration(new Date(), { days: -task.dayOffset });
    } catch (error) {
      console.error(error);
      if (task.notifyOnError) {
        console.log('Run notification logic here.');
      }
    }
  };
}
