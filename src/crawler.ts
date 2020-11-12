import puppeteer, { Page } from 'puppeteer';
import axios from 'axios';
import format from 'date-fns/format';
import config from './config';
import { upload } from './storage';

export async function getTickets(startDate = new Date(), endDate = new Date()): Promise<string> {
  const browser = await puppeteer.launch({ headless: config.headlessMode, args: ['--no-sandbox'] });
  const [page] = await browser.pages();
  await fwLogin(page);
  console.log('Navigating to tickets page...');
  await page.goto(config.fwTicketsUrl);
  await generateTickets(page, startDate, endDate);
  if (!(await checkResults(page))) {
    browser.close();
    throw new Error('No tickets exist for the given date.');
  }
  const filename = await sendDownloadRequest(page);
  if (config.closeBrowser) {
    browser.close();
  }
  return filename;
}

async function fwLogin(page: Page) {
  console.log('Logging into Fleetwatcher...');
  await page.goto(config.fwLoginUrl);
  await page.type('#id_username', config.fwUsername);
  await page.type('#id_password', config.fwPassword);
  await page.click('#sign_in > button');
  try {
    await page.waitForNavigation({ timeout: config.navTimeout });
  } catch (error) {
    console.log('Failed to detect navigation.');
  }
}

async function generateTickets(page: Page, startDate: Date, endDate: Date) {
  const start = format(startDate, 'M/d/yyyy HH:mm');
  const end = format(endDate, 'M/d/yyyy HH:mm');
  console.log(`Generating tickets from ${start} to ${end}...`);

  await page.click('#id_ticket_start_date', { clickCount: 3 });
  await page.type('#id_ticket_start_date', start);
  await page.keyboard.press('Tab');
  await page.type('#id_ticket_end_date', end);
  await page.keyboard.press('Tab');
  await page.click('#submit-id-generate');
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.navTimeout });
  } catch (error) {
    console.log('Failed to detect navigation.');
  }
}

async function checkResults(page: Page): Promise<boolean> {
  const elements = await page.$$('h3');
  for (let elem of elements) {
    const text = await page.evaluate(el => el.textContent, elem);
    if (text.toString() === 'No Results.') {
      return false;
    }
  }
  return true;
}

async function sendDownloadRequest(page: Page): Promise<string> {
  return new Promise(async (resolve, reject) => {
    await page.setRequestInterception(true);
    page.on('request', async request => {
      if (request.postData()?.includes('csrfmiddlewaretoken')) {
        const cookies = await page.cookies();
        const cookieStrings: string[] = [];
        cookies.forEach(cookie => {
          cookieStrings.push(`${cookie.name}=${cookie.value};`);
        });
        try {
          const filename = await downloadPdf(
            request.url(),
            request.headers(),
            cookieStrings.join(''),
            request.postData() || ''
          );
          resolve(filename);
        } catch (error) {
          reject(new Error('Failed to download PDF.'));
        }
      }
    });
    console.log('Downloading tickets...');
    // @ts-ignore
    await page.evaluate(() => sendPostFormPDF(allScaleTicketids));
  });
}

async function downloadPdf(
  url: string,
  headers: Record<string, string>,
  cookieString: string,
  postData: string
) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const res = await axios({
        method: 'POST',
        headers: {
          ...headers,
          cookie: cookieString,
        },
        url,
        data: postData,
        responseType: 'stream',
      });

      console.log('Uploading PDF to AWS S3...');
      const filename = res.headers['content-disposition'].split('filename="')[1].split('"')[0];
      res.data.pipe(
        upload(filename, err => {
          if (err) {
            reject(err);
            return;
          }
          resolve(config.s3DownloadsPath + filename);
        })
      );
    } catch (error) {
      reject(new Error('Failed to fetch PDF download.'));
    }
  });
}
