import addDuration from 'date-fns/add';
import { CronJob } from 'cron';
import { ScheduledTask, Task } from './tasks/task';

export async function scheduleTasks(): Promise<ScheduledTask[]> {
  const tasks = await Task.find();
  return tasks.map(task => ({ task, job: scheduleTask(task) }));
}

export function scheduleTask(task: Task) {
  const job = new CronJob(task.cronTime, buildTask(task), null, false, task.cronTimezone);
  job.start();
  return job;
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
