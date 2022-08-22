import { CorsOptions, CorsOptionsDelegate } from 'cors';
import { platform } from 'os';
import { HttpAdapter } from '../http';
import { LogFactory } from '../logging';
import { isFunction, isObject, isString } from '../utils/lang.util';
import { ApplicationOptions } from './interfaces';

export class Application {
  private readonly logger = LogFactory.getLog(Application.name);
  private isInitialized = false;
  private isListening = false;
  private httpServer: any;

  constructor(
    private readonly httpAdapter: HttpAdapter,
    private readonly options: ApplicationOptions = {},
  ) {
    this.registerHttpServer();
  }

  public async init(): Promise<this> {
    if (this.isInitialized) {
      return this;
    }

    this.applyOptions();

    const useBodyParser = this.options && this.options.bodyParser !== false;
    useBodyParser && this.registerParserMiddleware();

    this.isInitialized = true;
    this.logger.info('Application successfully started');
    return this;
  }

  public get(path: any, handler: any) {
    return this.httpAdapter.get(path, handler);
  }

  public async close(): Promise<void> {
    await this.dispose();
  }

  protected async dispose(): Promise<void> {
    this.httpAdapter && (await this.httpAdapter.close());
  }

  public applyOptions() {
    if (!this.options || !this.options.cors) {
      return undefined;
    }

    const passCustomOptions =
      isObject(this.options.cors) || isFunction(this.options.cors);

    if (!passCustomOptions) {
      return this.enableCors();
    }

    return this.enableCors(
      this.options.cors as CorsOptions | CorsOptionsDelegate<any>,
    );
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
    this.httpAdapter.initHttpServer(this.options);
    return this.httpAdapter.getHttpServer() as T;
  }

  public enableCors(options?: CorsOptions | CorsOptionsDelegate<any>): void {
    this.httpAdapter.enableCors(options);
  }

  public registerParserMiddleware() {
    const rawBody = !!this.options?.rawBody;
    this.httpAdapter.registerParserMiddleware(rawBody);
  }

  public async listen(port: number | string): Promise<any>;
  public async listen(port: number | string, hostname: string): Promise<any>;
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
    return this.options && this.options.httpsOptions ? 'https' : 'http';
  }
}
