import LogFactory from '../log-factory';

describe('Logger', () => {
  describe('with local context', () => {
    const localContext = 'LocalContext';

    let logger: any;
    let processStdoutWriteSpy: any;
    let processStderrWriteSpy: any;

    beforeEach(() => {
      logger = LogFactory.getLog();
      processStdoutWriteSpy = jest.spyOn(process.stdout, 'write');
      processStderrWriteSpy = jest.spyOn(process.stderr, 'write');
    });

    afterEach(() => {
      processStdoutWriteSpy = jest.restoreAllMocks();
      processStderrWriteSpy = jest.restoreAllMocks();
    });

    it('should print info message to the console', () => {
      const message = 'An INFO meaage';

      logger.info(message, localContext);

      expect(processStdoutWriteSpy).toHaveBeenCalledTimes(1);

      expect(processStdoutWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(localContext),
      );
      expect(processStdoutWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(message),
      );
    });

    it('should print info message without context to the console', () => {
      const message = 'An INFO message without context';

      logger.info(message);

      expect(processStdoutWriteSpy).toHaveBeenCalledTimes(1);

      expect(processStdoutWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(message),
      );
    });

    it('should print multiple info messages to the console', () => {
      const messages = ['INFO message 1', 'INFO message 2', 'INFO message 3'];

      logger.info(messages[0], messages[1], messages[2], localContext);

      expect(processStdoutWriteSpy).toHaveBeenCalledTimes(3);

      expect(processStdoutWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(localContext),
      );
      expect(processStdoutWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(messages[0]),
      );

      expect(processStdoutWriteSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(localContext),
      );
      expect(processStdoutWriteSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(messages[1]),
      );

      expect(processStdoutWriteSpy).toHaveBeenNthCalledWith(
        3,
        expect.stringMatching(localContext),
      );
      expect(processStdoutWriteSpy).toHaveBeenNthCalledWith(
        3,
        expect.stringMatching(messages[2]),
      );
    });

    it('should print error message to the console', () => {
      const message = 'An ERROR message';

      logger.error(message, localContext);

      expect(processStderrWriteSpy).toHaveBeenCalledTimes(1);

      expect(processStderrWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(localContext),
      );
      expect(processStderrWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(message),
      );
    });

    it('should print error message without context to the console', () => {
      const message = 'An ERROR message without context';

      logger.error(message);

      expect(processStderrWriteSpy).toHaveBeenCalledTimes(1);

      expect(processStderrWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(message),
      );
    });

    it('should print error object without context to the console', () => {
      const error = new Error('An ERROR message without context');

      logger.error(error);

      expect(processStderrWriteSpy).toHaveBeenCalledTimes(1);

      expect(processStderrWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(`Error: An ERROR message without context`),
      );
    });

    it('should serialise a plain JS object (as a message) without context to the console', () => {
      const error = {
        isError: true,
      };

      logger.error(error);

      expect(processStderrWriteSpy).toHaveBeenCalledTimes(1);

      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(`Object:`),
      );
      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(`{\n  "isError": true\n}`),
      );
    });

    it('should print error message with stacktrace and context to the console', () => {
      const message = 'An ERROR message with context';
      const stack = 'stacktrace';

      logger.error(message, stack, localContext);

      expect(processStderrWriteSpy).toHaveBeenCalledTimes(2);

      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(localContext),
      );
      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(message),
      );

      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(stack + '\n'),
      );
      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        2,
        expect.not.stringMatching(localContext),
      );
    });

    it('should print multiple error messages and one stacktrace to the console', () => {
      const messages = ['Error message 1', 'Error message 2'];
      const stack = 'stacktrace';

      logger.error(messages[0], messages[1], stack, localContext);

      expect(processStderrWriteSpy).toHaveBeenCalledTimes(3);

      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(localContext),
      );
      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(messages[0]),
      );

      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(localContext),
      );
      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(messages[1]),
      );

      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        3,
        expect.stringMatching(stack + '\n'),
      );
      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        3,
        expect.not.stringMatching(localContext),
      );
    });
  });

  describe('with global context', () => {
    const globalContext = 'GlobalContext';
    const logger = LogFactory.getLog(globalContext);

    let processStdoutWriteSpy: any;
    let processStderrWriteSpy: any;

    beforeEach(() => {
      processStdoutWriteSpy = jest.spyOn(process.stdout, 'write');
      processStderrWriteSpy = jest.spyOn(process.stderr, 'write');
    });

    afterEach(() => {
      processStdoutWriteSpy = jest.restoreAllMocks();
      processStderrWriteSpy = jest.restoreAllMocks();
    });

    it('should print info message to the console and append global context', () => {
      const message = 'An INFO meaage';

      logger.info(message);

      expect(processStdoutWriteSpy).toHaveBeenCalledTimes(1);

      expect(processStdoutWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(globalContext),
      );
      expect(processStdoutWriteSpy).toHaveBeenCalledWith(
        expect.stringMatching(message),
      );
    });

    it('should print error message with stacktrace to the console and append global context', () => {
      const message = 'An ERROR message with context';
      const stack = 'stacktrace';

      logger.error(message, stack);

      expect(processStderrWriteSpy).toHaveBeenCalledTimes(2);

      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(globalContext),
      );
      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(message),
      );

      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(stack + '\n'),
      );
      expect(processStderrWriteSpy).toHaveBeenNthCalledWith(
        2,
        expect.not.stringMatching(globalContext),
      );
    });
  });
});
