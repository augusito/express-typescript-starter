import { Scheduler } from '../../lib/scheduler';

export class TaskScheduler implements Scheduler {
  execute() {
    console.log('Called every 10 seconds');
  }
}
