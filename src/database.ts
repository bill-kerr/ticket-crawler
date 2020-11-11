import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from './config';
import { Ticket } from './ticket';

export function connectDatabase() {
  return createConnection({
    type: 'postgres',
    url: config.pgConnString,
    entities: [Ticket],
    synchronize: true,
  });
}
