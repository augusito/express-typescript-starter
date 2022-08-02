import { isPlainObject, isString } from '../utils/lang.util';
import { LogLevel, Log, LoggerOptions } from './interfaces';
import { DEFAULT_LOG_LEVELS } from './constants';
import { isLogLevelEnabled } from './utils';

export default class Logger implements Log {
  private originalContext?: string;

  constructor();
  constructor(context: string);
  constructor(context: string, options: LoggerOptions);
  constructor(
    protected context?: string,
    protected options: LoggerOptions = {},
  ) {
    if (!options.logLevels) {
      options.logLevels = DEFAULT_LOG_LEVELS;
    }

    if (context) {
      this.originalContext = context;
    }
  }

  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...options: [...any, string?, string?]): void;
  error(message: any, ...options: any[]) {
    if (!this.isLevelEnabled('error')) {
      return;
    }

    const { messages, context, stack } =
      this.getContextAndStackAndMessagesToPrint([message, ...options]);
    this.printMessages(messages, context, 'error', 'stderr');
    this.printStackTrace(stack);
  }

  warn(message: any, context?: string): void;
  warn(message: any, ...options: [...any, string?]): void;
  warn(message: any, ...options: any[]) {
    if (!this.isLevelEnabled('error')) {
      return;
    }

    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...options,
    ]);
    this.printMessages(messages, context, 'warn');
  }

  info(message: any, context?: string): void;
  info(message: any, ...options: [...any, string?]): void;
  info(message: any, ...options: any[]) {
    if (!this.isLevelEnabled('info')) {
      return;
    }

    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...options,
    ]);
    this.printMessages(messages, context, 'info');
  }

  verbose(message: any, context?: string): void;
  verbose(message: any, ...options: [...any, string?]): void;
  verbose(message: any, ...options: any[]) {
    if (!this.isLevelEnabled('verbose')) {
      return;
    }

    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...options,
    ]);
    this.printMessages(messages, context, 'verbose');
  }

  debug(message: any, context?: string): void;
  debug(message: any, ...options: [...any, string?]): void;
  debug(message: any, ...options: any[]) {
    if (!this.isLevelEnabled('debug')) {
      return;
    }

    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...options,
    ]);
    this.printMessages(messages, context, 'debug');
  }

  setLogLevels(levels: LogLevel[]) {
    if (!this.options) {
      this.options = {};
    }

    this.options.logLevels = levels;
  }

  setContext(context: string) {
    this.context = context;
  }

  resetContext() {
    this.context = this.originalContext;
  }

  isLevelEnabled(level: LogLevel): boolean {
    const logLevels = this.options?.logLevels;
    return isLogLevelEnabled(level, logLevels);
  }

  protected printMessages(
    messages: unknown[],
    context = '',
    logLevel: LogLevel = 'info',
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    messages.forEach((message) => {
      const pidMessage = this.formatPid(process.pid);
      const contextMessage = this.formatContext(context, 20);
      const formattedLogLevel = logLevel.toUpperCase().padStart(7, ' ');
      const formattedMessage = this.formatMessage(
        logLevel,
        message,
        pidMessage,
        formattedLogLevel,
        contextMessage,
      );
      process[writeStreamType ?? 'stdout'].write(formattedMessage);
    });
  }

  protected formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
  ) {
    message = this.stringifyMessage(message, logLevel);
    return `${this.getTimestamp()} ${formattedLogLevel} ${pidMessage} ${contextMessage} : ${message}\n`;
  }

  protected stringifyMessage(message: unknown, logLevel: LogLevel) {
    return isPlainObject(message)
      ? `${JSON.stringify(
          message,
          (key, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          2,
        )}\n`
      : (message as string);
  }

  protected formatContext(context: string, maxLength: number) {
    context = context.padEnd(maxLength, ' ');

    if (context.length > maxLength) {
      return context.slice(1 - maxLength).padStart(maxLength, '~');
    } else {
      return context;
    }
  }

  protected formatPid(pid: number) {
    return `${pid}`;
  }

  protected getTimestamp(): string {
    return new Date().toISOString().replace('T', ' ').substring(0, 23);
  }

  protected printStackTrace(stack: string) {
    if (!stack) {
      return;
    }

    process.stderr.write(`${stack}\n`);
  }

  private getContextAndMessagesToPrint(args: unknown[]) {
    if (args?.length <= 1) {
      return { messages: args, context: this.context };
    }

    const lastElement = args[args.length - 1];
    const isContext = isString(lastElement);

    if (!isContext) {
      return { messages: args, context: this.context };
    }

    return {
      context: lastElement as string,
      messages: args.slice(0, args.length - 1),
    };
  }

  private getContextAndStackAndMessagesToPrint(args: unknown[]) {
    const { messages, context } = this.getContextAndMessagesToPrint(args);

    if (messages?.length <= 1) {
      return { messages, context };
    }

    const lastElement = messages[messages.length - 1];
    const isStack = isString(lastElement);

    if (!isStack) {
      return { messages, context };
    }

    return {
      stack: lastElement as string,
      messages: messages.slice(0, messages.length - 1),
      context,
    };
  }
}
