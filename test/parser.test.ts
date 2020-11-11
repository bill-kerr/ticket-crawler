import fs from 'fs';
import path from 'path';
import { parsePdf } from '../src/parser';

let pdf: Buffer;
beforeAll(async () => {
  const filePath = path.join(__dirname, '..', 'downloads', 'scale_tickets_01.pdf');
  pdf = fs.readFileSync(filePath);
});

it('correctly parses a PDF', async () => {
  const tickets = await parsePdf({ buffer: pdf, filename: 'test.pdf' }, { project: '18203' });
  console.log(tickets);
});
