export interface CronOptions {
  cronTime: string | Date;
  name?: string;
  timeZone?: string;
  utcOffset?: string | number;
  unrefTimeout?: boolean;
}
