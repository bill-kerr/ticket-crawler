import dotenv from 'dotenv';
dotenv.config();
import { createConnection } from 'typeorm';
import { Ticket } from '../src/ticket';

beforeAll(async () => {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: [Ticket],
    name: 'default',
  });
});
