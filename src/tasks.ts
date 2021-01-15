import { deserializeArray } from 'class-transformer';
import { IsString } from 'class-validator';
import { CronJob } from 'cron';
import addDuration from 'date-fns/add';
import { loadConfigFile } from './config';
import { getTickets } from './crawler';
import { sendMail, sendErrorMail } from './messenger';
import { parsePdf } from './parser';
import { createPdfs } from './pdf';
import { getFile } from './storage';
import { delay, setDate } from './utils';

export class Task {
  @IsString()
  public cron: string = '';
  public cronTimezone: string = 'America/New_York';
  public fleetwatcherUsername: string = '';
  public fleetwatcherPassword: string = '';
  public projectNumber: string = '';
  public s3AccessKeyId: string = '';
  public s3SecretAccessKey: string = '';
  public s3Region: string = '';
  public s3Bucket: string = '';
  public s3DownloadsPath: string = '';
  public ticketDayOffset: number = 1;
  public ticketDayStartTime: string = '0:00';
  public ticketDayEndTime: string = '23:59';
  public retryDelay: number = 60000;
  public maxRetries: number = 5;
  public emailSend: boolean = true;
  public emailServer: string = '';
  public emailPort: number = 465;
  public emailUsername: string = '';
  public emailPassword: string = '';
  public emailTargets: string[] = [];
  public emailCopyTargets: string[] = [];
  public emailOnError: boolean = true;
  public emailErrorTargets: string[] = [];
}

export function scheduleTask(task: Task) {
  const job = new CronJob(task.cron, buildRunnable(task), null, false, task.cronTimezone);
  job.start();
  return job;
}

function buildRunnable(task: Task) {
  return async () => {
    for (let i = 0; i < task.maxRetries; i++) {
      try {
        await processTickets(task);
      } catch (error) {
        console.error(error);
        await delay(task.retryDelay);
        if (i === task.maxRetries - 1 && task.emailOnError) {
          await sendErrorMail(error);
        }
        continue;
      }
      break;
    }
  };
}

async function processTickets(task: Task) {
  const targetDate = addDuration(new Date(), { days: -task.ticketDayOffset });
  const filename = await getTickets(
    setDate(targetDate, task.ticketDayStartTime),
    setDate(targetDate, task.ticketDayEndTime)
  );
  const pdfFile = await getFile(filename);
  const tickets = await parsePdf(pdfFile, { project: task.projectNumber });
  const filenames = await createPdfs(tickets, pdfFile, targetDate);
  await sendMail(targetDate, filenames);
}

export function createTasks() {
  const data = loadConfigFile();
  return transformData(data);
}

function transformData(data: string) {
  const parsed = JSON.parse(data);
  if (!parsed.tasks) {
    throw new Error('No tasks found in configuration file.');
  }
  return deserializeArray(Task, parsed.tasks);
}
