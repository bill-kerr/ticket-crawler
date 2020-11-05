import dotenv from 'dotenv';
dotenv.config();
import { createConnection } from 'typeorm';

beforeAll(async () => {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    logging: false,
    name: 'default',
  });
});
