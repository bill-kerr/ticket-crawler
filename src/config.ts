import * as fs from 'fs';

export default {
  port: parseInt(process.env.PORT || '3333', 10),

  pdfSplitKey: process.env.PDF_SPLIT_KEY || '',
  pdfTicketMustInclude: process.env.PDF_MUST_INCLUDE || '',

  downloadTimeout: parseInt(process.env.DL_TIMEOUT || '30000', 10),
  navTimeout: parseInt(process.env.NAV_TIMEOUT || '15000', 10),
  headlessMode: (process.env.HEADLESS_MODE || '').toLowerCase() !== 'false',
  closeBrowser: (process.env.CLOSE_BROWSER || '').toLowerCase() !== 'false',

  fwLoginUrl: process.env.FW_LOGIN_URL || '',
  fwTicketsUrl: process.env.FW_TICKETS_URL || '',

  pgConnString: process.env.PG_CONN_STRING || '',
};

export function loadConfigFile() {
  const data = fs.readFileSync('crawler.config.json', 'utf-8');
  if (!data) {
    throw new Error("You must create a 'crawler.config.json' file in the root of the project.");
  }
  return data;
}
