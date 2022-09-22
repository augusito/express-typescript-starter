import { platform } from 'os';
import { iterate } from 'iterare';
import { LogFactory } from '../logging';
import { isFunction, isString } from '../utils/lang.util';
import { ApplicationOptions } from './interfaces';
import { ErrorResponseGenerator } from './response/error-response-generator';
import { HookCollector } from './hooks/hook-collector';
import { HttpAdapter } from './http-adapter';
import { MiddlewareFactory } from './middleware/middleware-factory';
import { MiddlewareProxy } from './middleware/middleware-proxy';
import { ShutdownSignal } from './enums/shutdown-signal.enum';

export class Application {
  private readonly logger = LogFactory.getLog(Application.name);
  private readonly middlewareProxy = new MiddlewareProxy();
  private readonly activeShutdownSignals = new Array<string>();
  private shutdownCleanupRef?: (...args: unknown[]) => unknown;
  private isInitialized = false;
  private isListening = false;
  protected httpServer: any;

  constructor(
    private readonly httpAdapter: HttpAdapter,
    private readonly factory: MiddlewareFactory,
    private readonly hookCollector: HookCollector,
    private readonly appOptions: ApplicationOptions = {},
  ) {
    this.registerHttpServer();
  }

  public async init(): Promise<this> {
    if (this.isInitialized) {
      return this;
    }

    await this.hookCollector.callBootstrapHook();

    this.isInitialized = true;
    this.logger.info('Application successfully started');
    return this;
  }

  public use(...args: [any, any?]): this {
    this.httpAdapter.use(this.bindHandler(...args));
    return this;
  }

  public get(path: any, ...args: [any, any?]) {
    this.httpAdapter.get(path, this.bindHandler(...args));
    return this;
  }

  public post(path: any, ...args: [any, any?]) {
    this.httpAdapter.post(path, this.bindHandler(...args));
    return this;
  }

  public put(path: any, ...args: [any, any?]) {
    this.httpAdapter.put(path, this.bindHandler(...args));
    return this;
  }

  public patch(path: any, ...args: [any, any?]) {
    this.httpAdapter.patch(path, this.bindHandler(...args));
    return this;
  }

  public delete(path: any, ...args: [any, any?]) {
    this.httpAdapter.delete(path, this.bindHandler(...args));
    return this;
  }

  public async close(): Promise<void> {
    await this.dispose();
    await this.hookCollector.callShutdownHook();
    this.unsubscribeFromProcessSignals();
  }

  protected async dispose(): Promise<void> {
    this.httpAdapter && (await this.httpAdapter.close());
  }

  public getHttpAdapter(): HttpAdapter {
    return this.httpAdapter as HttpAdapter;
  }

  public getHttpServer() {
    return this.httpServer;
  }

  public registerHttpServer() {
    this.httpServer = this.createServer();
  }

  public createServer<T = any>(): T {
    this.httpAdapter.initHttpServer(this.appOptions);
    return this.httpAdapter.getHttpServer() as T;
  }

  public enableShutdownHooks(signals: (ShutdownSignal | string)[] = []): this {
    if (signals.length === 0) {
      signals = Object.keys(ShutdownSignal).map(
        (key: string) => ShutdownSignal[key],
      );
    } else {
      // given signals array should be unique because
      // process shouldn't listen to the same signal more than once.
      signals = Array.from(new Set(signals));
    }

    signals = iterate(signals)
      .map((signal: string) => signal.toString().toUpperCase().trim())
      // filter out the signals which is already listening to
      .filter((signal) => !this.activeShutdownSignals.includes(signal))
      .toArray();

    this.listenToShutdownSignals(signals);
    return this;
  }

  public async listen(port: number | string, ...args: any[]): Promise<any> {
    !this.isInitialized && (await this.init());

    return new Promise((resolve, reject) => {
      const errorHandler = (e: any) => {
        this.logger.error(e?.toString?.());
        reject(e);
      };

      this.httpServer.once('error', errorHandler);

      const isCallbackInOriginalArgs = isFunction(args[args.length - 1]);
      const listenFnArgs = isCallbackInOriginalArgs
        ? args.slice(0, args.length - 1)
        : args;

      this.httpAdapter.listen(
        port,
        ...listenFnArgs,
        (...originalCallbackArgs: unknown[]) => {
          if (originalCallbackArgs[0] instanceof Error) {
            return reject(originalCallbackArgs[0]);
          }

          const address = this.httpServer.address();
          if (address) {
            this.httpServer.removeListener('error', errorHandler);
            this.isListening = true;
            resolve(this.httpServer);
          }
          if (isCallbackInOriginalArgs) {
            args[args.length - 1](...originalCallbackArgs);
          }
        },
      );
    });
  }

  public async getUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isListening) {
        const message =
          'app.listen() needs to be called before calling app.getUrl()';
        this.logger.error(message);
        reject(message);
      }
      const address = this.httpServer.address();
      resolve(this.formatAddress(address));
    });
  }

  private formatAddress(address: any): string {
    if (isString(address)) {
      if (platform() === 'win32') {
        return address;
      }
      const basePath = encodeURIComponent(address);
      return `${this.getProtocol()}+unix://${basePath}`;
    }

    let host = this.host();
    if (address && address.family === 'IPv6') {
      if (host === '::') {
        host = '[::1]';
      } else {
        host = `[${host}]`;
      }
    } else if (host === '0.0.0.0') {
      host = '127.0.0.1';
    }

    return `${this.getProtocol()}://${host}:${address.port}`;
  }

  private host(): string | undefined {
    const address = this.httpServer.address();
    if (isString(address)) {
      return undefined;
    }
    return address && address.address;
  }

  private getProtocol(): 'http' | 'https' {
    return this.appOptions && this.appOptions.httpsOptions ? 'https' : 'http';
  }

  private bindHandler(...args: any) {
    let middleware = this.factory.prepare(args);
    if (!Array.isArray(middleware)) {
      middleware = [middleware];
    }

    return middleware.map((mid: any) => {
      const instance = mid.process.bind(mid);
      const generator = new ErrorResponseGenerator();
      return this.middlewareProxy.createProxy(instance, generator);
    });
  }

  private listenToShutdownSignals(signals: string[]) {
    const cleanup = async (signal: string) => {
      try {
        signals.forEach((sig) => process.removeListener(sig, cleanup));
        await this.dispose();
        await this.hookCollector.callShutdownHook(signal);
        process.kill(process.pid, signal);
      } catch (err) {
        this.logger.error(
          'Error happened during shutdown',
          (err as Error)?.stack,
          Application.name,
        );
        process.exit(1);
      }
    };

    this.shutdownCleanupRef = cleanup as (...args: unknown[]) => unknown;

    signals.forEach((signal: string) => {
      this.activeShutdownSignals.push(signal);
      process.on(signal as any, cleanup);
    });
  }

  private unsubscribeFromProcessSignals() {
    if (!this.shutdownCleanupRef) {
      return;
    }

    this.activeShutdownSignals.forEach((signal) => {
      process.removeListener(signal, this.shutdownCleanupRef);
    });
  }
}
