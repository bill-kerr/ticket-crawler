import set from 'date-fns/set';

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function setDate(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(value => parseInt(value, 10));
  return set(date, { hours, minutes });
}
