import fs from 'fs';
import path from 'path';
import { parsePdf, tonsToPounds } from '../src/parser';

let pdf: Buffer;
beforeAll(async () => {
  const filePath = path.join(__dirname, '..', 'downloads', 'scale_tickets_01.pdf');
  pdf = fs.readFileSync(filePath);
});

it('correctly parses a PDF', async () => {
  const tickets = await parsePdf({ buffer: pdf, filename: 'test.pdf' }, { project: '18203' });
  expect(tickets.length).toBe(8);
  const ticket = tickets[1];
  expect(ticket).toStrictEqual({
    id: expect.any(String),
    date: '2020-11-04',
    time: '13:09',
    supplierCode: expect.any(String),
    ticketNumber: '218029',
    project: '18203',
    truck: '142',
    product: '57DYER',
    grossPounds: 70780,
    tarePounds: 27620,
    netPounds: 43160,
    loadNumber: 2,
    totalPounds: 86000,
    weighmaster: expect.any(String),
    plantId: '1',
    productName: expect.any(String),
    shipOrReceive: 'S',
    srcFile: 'test.pdf',
    srcPage: 1,
    createdAt: expect.any(Number),
    updatedAt: expect.any(Number),
  });
});

it('calculates tons to pounds correctly', () => {
  const values = {
    '23.49': 46980,
    '999.99': 1999980,
    '2.56': 5120,
    '0.56': 1120,
    '.56': 1120,
    '43.0': 86000,
    '.2': 400,
  };
  Object.entries(values).forEach(([key, val]) => expect(tonsToPounds(key) === val).toBe(true));
});
