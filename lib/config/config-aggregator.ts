import { merge } from './utils';

export class ConfigAggregator {
  private config: any;
  constructor(options = []) {
    this.config = this.loadConfig(options);
  }

  public getMergedConfig() {
    return this.config;
  }

  private loadConfig(options: any): any {
    const mergedConfig = {};
    for (const option of options) {
      merge(mergedConfig, option);
    }
    return mergedConfig;
  }
}
