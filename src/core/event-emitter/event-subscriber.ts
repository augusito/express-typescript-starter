import { OnApplicationBootstrap } from '../application/interfaces';

export class EventSubscriber implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('on application bootstrap!');
  }
}
