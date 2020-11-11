import pdf from 'pdf-parse';
import parseDate from 'date-fns/parse';
import formatDate from 'date-fns/format';
import config from './config';
import { PdfFile } from './storage';
import { Ticket } from './ticket';

interface PdfFilter {
  project?: string;
}

export async function parsePdf(file: PdfFile, filter: PdfFilter = {}) {
  const text = await getPdfText(file.buffer);
  const preppedText = prepText(text);
  return createTickets(preppedText, filter, file);
}

async function getPdfText(fileBuffer: Buffer) {
  const pdfFile = await pdf(fileBuffer);
  return pdfFile.text;
}

function prepText(text: string) {
  const splitText = splitTickets(text);
  const tags = [
    'Date:',
    'Time:',
    'Supplier Code:',
    'Ticket #:',
    'Product:',
    'Company Project Name:',
    'Plant Number:',
    'FreeForm1:',
    'Driver:',
    'DOT Job Number:',
    'Gross:',
    'Tare:',
    'Net:',
    'Loads:',
    'Tons:',
  ];
  return splitText.map(text => {
    tags.forEach(tag => {
      const start = text.search(tag);
      if (verify(start) && text.slice(start, start + tag.length + 1).indexOf('\n') > -1) {
        text =
          text.slice(0, start + tag.length) + ' ' + text.slice(start + tag.length + 1, text.length);
      }
      if (verify(start) && text[start - 1] !== '\n') {
        text = text.slice(0, start) + '\n' + text.slice(start, text.length);
      }
    });
    return text;
  });
}

function splitTickets(text: string) {
  return text.split(config.pdfSplitKey).filter(txt => txt.includes(config.pdfTicketMustInclude));
}

async function createTickets(
  ticketText: string[],
  filter: PdfFilter,
  file: PdfFile
): Promise<Ticket[]> {
  const tickets = await Promise.all(
    ticketText.map(async (txt, i) => await createTicket(txt, i, file))
  );
  return tickets.filter(ticket => filterTicket(ticket, filter));
}

async function createTicket(txt: string, page: number, file: PdfFile): Promise<Ticket> {
  const ticketNumber = findWithNewline(txt, 'Ticket #: ');
  const existingTicket = await Ticket.findOne({ ticketNumber });
  if (existingTicket) {
    existingTicket.srcFile = file.filename;
    existingTicket.srcPage = page;
    return existingTicket.save();
  }

  const ticket = Ticket.create({
    date: findDate(txt, 'yyyy-MM-dd'),
    time: findTime(txt),
    ticketNumber,
    grossPounds: findGross(txt),
    tarePounds: findTare(txt),
    netPounds: findNet(txt),
    truck: findWithNewline(txt, 'Truck: '),
    supplierCode: findWithNewline(txt, 'Supplier Code: '),
    project: findWithNewline(txt, 'Company Project Name: '),
    product: findWithNewline(txt, 'Product:'),
    productName: findWithNewline(txt, 'Product Name: '),
    loadNumber: findLoadNumber(txt),
    totalPounds: findTotalPounds(txt),
    weighmaster: findWithNewline(txt, 'Weighmaster: '),
    plantId: findWithNewline(txt, 'PlantId: '),
    shipOrReceive: findWithNewline(txt, 'ShipOrReceive: '),
    srcFile: file.filename,
    srcPage: page,
  });
  return ticket.save();
}

function verify(...positions: number[]): boolean {
  for (let pos of positions) {
    if (pos < 0) {
      return false;
    }
  }
  return true;
}

function filterTicket(ticket: Ticket, filter: PdfFilter): boolean {
  if (filter.project && filter.project === ticket.project) {
    return true;
  }
  return false;
}

function tonsToPounds(strTons: string): number {
  return parseInt(strTons.replace('.', '')) * 20;
}

function findWithNewline(txt: string, key: string): string {
  const startPos = txt.search(key);
  const endPos = txt.slice(startPos).search('\n');
  return verify(startPos, endPos) ? txt.slice(startPos + key.length, startPos + endPos).trim() : '';
}

function findDate(txt: string, format: string): string {
  const pos = txt.search('Date:');
  if (!verify(pos)) {
    return '';
  }
  const dateText = txt.replace('\n', '').slice(pos + 5, pos + 14);
  const date = parseDate(dateText, 'MM/dd/yy', new Date());
  return formatDate(date, format);
}

function findTime(txt: string): string {
  const pos = txt.search('Time: ');
  return verify(pos) ? txt.slice(pos + 6, pos + 11) : '';
}

function findGross(txt: string): number {
  const strAmount = findWithNewline(txt, 'Gross:').replace('TN', '').trim();
  return tonsToPounds(strAmount);
}

function findTare(txt: string): number {
  const strAmount = findWithNewline(txt, 'Tare:').replace('TN', '').trim();
  return tonsToPounds(strAmount);
}

function findNet(txt: string): number {
  const strAmount = findWithNewline(txt, 'Net:').replace('TN', '').trim();
  return tonsToPounds(strAmount);
}

function findLoadNumber(txt: string): number {
  const startPos = txt.search('Loads: ');
  const endPos = txt.search('Tons: ');
  const amountStr = verify(startPos, endPos) ? txt.slice(startPos + 7, endPos).trim() : '0';
  return parseInt(amountStr);
}

function findTotalPounds(txt: string): number {
  const startPos = txt.search('Tons: ');
  const endPos = txt.slice(startPos).search('\n');
  const amountStr = verify(startPos, endPos)
    ? txt.slice(startPos + 6, startPos + endPos).trim()
    : '0';
  return tonsToPounds(amountStr);
}
