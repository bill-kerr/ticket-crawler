import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from './config';
import { Recipient } from './recipients/recipient';
import { Task } from './tasks/task';

export function connectDatabase() {
  return createConnection({
    type: 'postgres',
    url: config.pgConnString,
    entities: [Task, Recipient],
    synchronize: true,
  });
}
