import { CronJob } from 'cron';
import addDuration from 'date-fns/add';
import set from 'date-fns/set';
import config from './config';
import { getTickets } from './crawler';
import { sendMail } from './messenger';
import { parsePdf } from './parser';
import { createPdfs } from './pdf';
import { getFile } from './storage';

export function scheduleTask() {
  const job = new CronJob(config.ticketCron, processTickets, null, false, config.cronTimezone);
  job.start();
  return job;
}

async function processTickets() {
  const targetDate = addDuration(new Date(), { days: -config.ticketDayOffset });
  const filename = await getTickets(
    setDate(targetDate, config.ticketDayStartTime),
    setDate(targetDate, config.ticketDayEndTime)
  );
  const pdfFile = await getFile(filename);
  const tickets = await parsePdf(pdfFile, { project: config.projectNumber });
  const filenames = await createPdfs(tickets, pdfFile, targetDate);
  await sendMail(targetDate, filenames);
}

function setDate(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(value => parseInt(value, 10));
  return set(date, { hours, minutes });
}
