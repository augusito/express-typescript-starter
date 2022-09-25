import * as glob from 'glob';
import { merge } from '../config';
import { dynamicRequire } from './utils';

export class AutoloadModule {
  static register(pattern: any) {
    let config = {};
    // Load configuration from autoload path
    const paths = glob.sync(pattern, { nosort: true });
    // Require each file in the autload dir
    paths.forEach((file: any) => {
      config = merge(config, dynamicRequire(file));
    });
    // return a an object containing of configurations
    return config;
  }
}
