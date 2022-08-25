import * as glob from 'glob';
import dynamicRequire from '../utils/dynamic-require';

export class AutoloadModule {
  static register(pattern: any) {
    let config = {};
    // Load configuration from autoload path
    const files = glob.sync(pattern);
    console.log(files);
    // Require each file in the autload dir
    files.forEach((file: any) => {
      config = Object.assign(config, dynamicRequire(file));
    });

    // return a an object containing of configurations
    return config;
  }
}
