import * as glob from 'glob';
import { merge } from '../config';

export class AutoloadModule {
  static register(pattern: any) {
    // Load configuration from autoload path
    const paths = glob.sync(pattern, { nosort: true });
    // return an object containing of configurations
    return paths.reduce(async (acc, path) => {
      const obj = await acc; // This waits for the previous iteration to resolve
      const mod = await import(path); // Import each loaded JS file
      const result = merge(obj, mod.default); // Merge the result
      return result; // Return an object containing of configurations
    }, Promise.resolve({})); // Start with an immediately resolved promise
  }
}
