export interface LoginDto {
  username?: string;
  password?: string;
}

export interface CreateTaskDto {
  description?: string;
  cronTime?: string;
  cronTimezone?: string;
  dayOffset?: number;
  notifyOnError?: boolean;
}
