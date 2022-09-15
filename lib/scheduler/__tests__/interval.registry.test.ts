import { SchedulerRegistry } from '../scheduler.registry';

describe('Interval', () => {
  let registry: SchedulerRegistry;

  beforeEach(() => {
    registry = new SchedulerRegistry();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it(`should add interval`, () => {
    const intervalRef = setInterval(() => {}, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    expect(registry.getInterval('TEST')).not.toBeUndefined();
  });

  it(`should return and schedule interval`, () => {
    let called = false;

    const intervalRef = setInterval(() => {
      called = true;
      clearInterval(registry.getInterval('TEST'));
    }, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    const intervals = registry.getIntervals();
    expect(intervals).toContain('TEST');

    const interval = registry.getInterval('TEST');
    expect(interval).toBeDefined();

    expect(called).toBeFalsy();
    jest.runAllTimers();
    expect(called).toBeTruthy();
  });

  it(`should remove interval`, () => {
    const intervalRef = setInterval(() => {}, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    let interval = registry.getInterval('TEST');
    expect(interval).toBeDefined();

    registry.removeInterval('TEST');
    try {
      interval = registry.getInterval('TEST');
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.message).toEqual(
        'No Interval was found with the given name (TEST).',
      );
    }
  });

  it('should throw when duplicate interval', () => {
    const intervalRef = setInterval(() => {}, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    try {
      registry.addInterval('TEST', intervalRef as unknown as number);
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.message).toEqual(
        'Interval with the given name (TEST) already exists. Ignored.',
      );
    }
  });

  it('should return true for interval', () => {
    const intervalRef = setInterval(() => {}, 2500);

    registry.addInterval('TEST', intervalRef as unknown as number);
    expect(registry.doesExist('interval', 'TEST')).toEqual(true);
  });

  it('should return false for interval', () => {
    expect(registry.doesExist('interval', 'TEST')).toEqual(false);
  });
});
