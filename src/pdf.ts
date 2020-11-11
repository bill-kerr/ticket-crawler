import { PDFDocument } from 'pdf-lib';
import formatDate from 'date-fns/format';
import { Ticket } from './ticket';
import { PdfFile, uploadFromBytes } from './storage';

type TicketMap = { [key: string]: Ticket[] };
type DocMap = { [key: string]: PDFDocument[] };

export async function createPdfs(tickets: Ticket[], srcFile: PdfFile, date: Date) {
  const ticketMap = mapTickets(tickets);
  const srcDoc = await PDFDocument.load(srcFile.buffer);
  const docs = await createDocs(ticketMap, srcDoc, date);
  return uploadDocs(docs);
}

function mapTickets(tickets: Ticket[]): TicketMap {
  const pdfMap: TicketMap = {};
  tickets.forEach(ticket => {
    if (!(ticket.product in pdfMap)) {
      pdfMap[ticket.product] = [];
    }
    pdfMap[ticket.product].push(ticket);
  });
  return pdfMap;
}

async function createDocs(ticketMap: TicketMap, srcDoc: PDFDocument, date: Date): Promise<DocMap> {
  const docMap: DocMap = {};
  await Promise.all(
    Object.entries(ticketMap).map(async ([key, tickets]) => {
      if (!(key in docMap)) {
        docMap[key] = [];
      }
      const doc = await createDoc(tickets, srcDoc);
      doc.setTitle(createTitle(date, key));
      docMap[key].push(doc);
    })
  );
  return docMap;
}

async function createDoc(tickets: Ticket[], srcDoc: PDFDocument): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  const pageNums = tickets.map(ticket => ticket.srcPage);
  const pages = await doc.copyPages(srcDoc, pageNums);
  pages.forEach(page => doc.addPage(page));
  return doc;
}

function createTitle(date: Date, material: string): string {
  return `${formatDate(date, 'yyyy-MM-dd')}_${material}`;
}

async function uploadDocs(docs: DocMap) {
  const filenames: string[] = [];
  await Promise.all(
    Object.entries(docs).map(async ([key, docs]) => {
      await Promise.all(
        docs.map(async doc => {
          const filename = await uploadDoc(doc, key);
          filenames.push(filename);
        })
      );
    })
  );
  return filenames;
}

async function uploadDoc(doc: PDFDocument, key: string) {
  const bytes = await doc.save();
  const filename = `${key}/${doc.getTitle()}.pdf`;
  await uploadFromBytes(bytes, filename);
  return filename;
}
