import { SchedulerRegistry } from '../scheduler.registry';

describe('Timeout', () => {
  let registry: SchedulerRegistry;

  beforeEach(() => {
    registry = new SchedulerRegistry();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it(`should add timeout`, () => {
    const timeoutRef = setTimeout(() => {}, 2500);

    registry.addTimeout('TEST', timeoutRef as unknown as number);
    expect(registry.getTimeout('TEST')).not.toBeUndefined();
  });

  it(`should return and schedule timeout`, () => {
    let called = false;

    const timeoutRef = setTimeout(() => {
      called = true;
      clearTimeout(registry.getTimeout('TEST'));
    }, 2500);

    registry.addTimeout('TEST', timeoutRef as unknown as number);
    const timeouts = registry.getTimeouts();
    expect(timeouts).toContain('TEST');

    const timeout = registry.getTimeout('TEST');
    expect(timeout).toBeDefined();

    expect(called).toBeFalsy();
    jest.runAllTimers();
    expect(called).toBeTruthy();
  });

  it(`should remove timeout`, () => {
    const timeoutRef = setTimeout(() => {}, 2500);

    registry.addTimeout('TEST', timeoutRef as unknown as number);
    let timeout = registry.getTimeout('TEST');
    expect(timeout).toBeDefined();

    registry.removeTimeout('TEST');
    try {
      timeout = registry.getTimeout('TEST');
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.message).toEqual(
        'No Timeout was found with the given name (TEST).',
      );
    }
  });

  it('should throw when duplicate timeout', () => {
    const timeoutRef = setTimeout(() => {}, 2500);

    registry.addTimeout('TEST', timeoutRef as unknown as number);
    try {
      registry.addTimeout('TEST', timeoutRef as unknown as number);
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.message).toEqual(
        'Timeout with the given name (TEST) already exists. Ignored.',
      );
    }
  });

  it('should return true for timeout', () => {
    const timeoutRef = setTimeout(() => {}, 2500);

    registry.addTimeout('TEST', timeoutRef as unknown as number);
    expect(registry.doesExist('timeout', 'TEST')).toEqual(true);
  });

  it('should return false for timeout', () => {
    expect(registry.doesExist('timeout', 'TEST')).toEqual(false);
  });
});
