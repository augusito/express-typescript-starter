import { Container } from '../src/core/container';
import { omit } from '../src/core/utils/object.util';
import { config } from './config';

const container = new Container(config?.providers);

container.addProvider({
  provide: 'config',
  useValue: omit(config, ['providers']),
});

export { container };
