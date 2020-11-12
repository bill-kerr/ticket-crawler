export default {
  port: parseInt(process.env.PORT || '3333', 10),

  pdfSplitKey: process.env.PDF_SPLIT_KEY || '',
  pdfTicketMustInclude: process.env.PDF_MUST_INCLUDE || '',

  downloadTimeout: parseInt(process.env.DL_TIMEOUT || '30000', 10),
  navTimeout: parseInt(process.env.NAV_TIMEOUT || '15000', 10),
  headlessMode: (process.env.HEADLESS_MODE || '').toLowerCase() !== 'false',
  closeBrowser: (process.env.CLOSE_BROWSER || '').toLowerCase() !== 'false',

  ticketCron: process.env.TICKET_CRON || '0 15 0 * * *',
  retryDelay: parseInt(process.env.RETRY_DELAY || '60000', 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || '5', 10),
  cronTimezone: process.env.CRON_TIMEZONE || 'America/New_York',

  fwUsername: process.env.FW_USERNAME || '',
  fwPassword: process.env.FW_PASSWORD || '',
  fwLoginUrl: process.env.FW_LOGIN_URL || '',
  fwTicketsUrl: process.env.FW_TICKETS_URL || '',
  projectNumber: process.env.PROJECT_NUMBER || 'All',

  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID || '',
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  s3Region: process.env.S3_REGION || '',
  s3Bucket: process.env.S3_BUCKET || '',
  s3DownloadsPath: process.env.S3_DOWNLOADS_PATH || '',

  emailSend: (process.env.EMAIL_SEND || 'false').toLowerCase() === 'true',
  emailServer: process.env.EMAIL_SERVER || '',
  emailPort: parseInt(process.env.EMAIL_PORT || '', 10),
  emailUsername: process.env.EMAIL_USERNAME || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  emailTargets: (process.env.EMAIL_TARGETS || '').split(','),
  emailCopyTargets: (process.env.EMAIL_COPY_TARGETS || '').split(','),

  pgConnString: process.env.PG_CONN_STRING || '',

  ticketDayOffset: parseInt(process.env.TICKET_DAY_OFFSET || '1', 10),
  ticketDayStartTime: process.env.TICKET_DAY_START_TIME || '0:00',
  ticketDayEndTime: process.env.TICKET_DAY_END_TIME || '23:59',
};
