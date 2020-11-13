import { createTransport } from 'nodemailer';
import formatDate from 'date-fns/format';
import config from './config';
import { getFile } from './storage';

export async function sendMail(date: Date, filenames: string[]) {
  if (filenames.length < 1 || !config.emailSend) {
    return;
  }

  const transporter = createTransporter();
  const formattedDate = formatDate(date, 'yyyy-MM-dd');
  await transporter.sendMail({
    from: config.emailUsername,
    to: config.emailTargets,
    cc: config.emailCopyTargets,
    subject: `Tickets for ${formattedDate}`,
    text: `Please see attached tickets for ${formattedDate}.`,
    attachments: await createAttachments(filenames),
  });
  console.log('Emailed tickets to recipients...');
}

export async function sendErrorMail(error: string) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: config.emailUsername,
    to: config.errorEmailTargets,
    subject: 'TicketCrawler: An error occurred while processing tickets.',
    text: `The following error occurred while processing tickets:\n${error}`,
  });
  console.log('Emailed error message to recipients...');
}

function createTransporter() {
  return createTransport({
    host: config.emailServer,
    port: config.emailPort,
    secure: true,
    auth: {
      user: config.emailUsername,
      pass: config.emailPassword,
    },
  });
}

async function createAttachments(filenames: string[]) {
  return Promise.all(
    filenames.map(async filename => {
      const name = filename.split('/');
      const file = await getFile(filename);
      return {
        filename: name[name.length - 1],
        content: file.buffer,
      };
    })
  );
}
