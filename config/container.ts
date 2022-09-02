import { Container } from '../lib/container';
import { omit } from '../lib/utils/object.util';
import { config } from './config';

const container = new Container(config?.providers);

container.addProvider({
  provide: 'config',
  useValue: omit(config, ['providers']),
});

export { container };
