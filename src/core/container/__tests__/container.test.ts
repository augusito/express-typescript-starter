import { Container } from '../container';
import { Provider } from '../interfaces';

class Engine {}

class BrokenEngine {
  constructor() {
    throw new Error('Broken Engine');
  }
}

class DashboardSoftware {}

class Dashboard {
  constructor(software: DashboardSoftware) {}
}

class TurboEngine extends Engine {}

class Car {
  constructor(public engine: Engine) {}
}

class CarWithOptionalEngine {
  constructor(public engine?: Engine) {}
}

class CarWithDashboard {
  engine: Engine;
  dashboard: Dashboard;
  constructor(engine: Engine, dashboard: Dashboard) {
    this.engine = engine;
    this.dashboard = dashboard;
  }
}

class SportsCar extends Car {}

function createContainer(providers: Provider[]): Container {
  return new Container(providers);
}

describe('Container', () => {
  it('should instantiate a class without dependencies', () => {
    const container = createContainer([{ provide: Engine, useClass: Engine }]);
    const engine = container.get(Engine);

    expect(engine).toBeInstanceOf(Engine);
  });

  it('should resolve dependencies based on the constructor', () => {
    const container = createContainer([
      { provide: Engine, useClass: Engine },
      {
        provide: Car,
        useFactory: (container: Container) => new Car(container.get(Engine)),
      },
    ]);
    const car = container.get<Car>(Car);

    expect(car).toBeInstanceOf(Car);
    expect(car.engine).toBeInstanceOf(Engine);
  });

  it('should cache instances', () => {
    const container = createContainer([{ provide: Engine, useClass: Engine }]);

    const a1 = container.get(Engine);
    const a2 = container.get(Engine);

    expect(a1).toBe(a2);
  });

  it('should provide to a value', () => {
    const container = createContainer([
      { provide: Engine, useValue: 'fake engine' },
    ]);
    const engine = container.get(Engine);

    expect(engine).toEqual('fake engine');
  });

  it('should provide to a factory', () => {
    function sportsCarFactory(container: Container) {
      return new SportsCar(container.get(Engine));
    }
    const container = createContainer([
      { provide: Engine, useClass: Engine },
      { provide: Car, useFactory: sportsCarFactory },
    ]);
    const car = container.get<Car>(Car);

    expect(car).toBeInstanceOf(SportsCar);
    expect(car.engine).toBeInstanceOf(Engine);
  });

  it('should supporting provider to null', () => {
    const container = createContainer([{ provide: Engine, useValue: null }]);
    const engine = container.get(Engine);

    expect(engine).toBeNull();
  });

  it('should provide to an alias', () => {
    const container = createContainer([
      { provide: Engine, useClass: Engine },
      {
        provide: SportsCar,
        useFactory: (container: Container) =>
          new SportsCar(container.get(Engine)),
      },
      { provide: Car, useExisting: SportsCar },
    ]);
    const car = container.get(Car);
    const sportsCar = container.get(SportsCar);

    expect(car).toBeInstanceOf(SportsCar);
    expect(car).toBe(sportsCar);
  });

  it('should throw when the aliased provider does not exist', () => {
    const container = createContainer([
      { provide: 'car', useExisting: SportsCar },
    ]);

    expect(() => container.get('car')).toThrowError();
  });

  it('should support overriding factory dependencies', () => {
    const container = createContainer([
      { provide: Engine, useClass: Engine },
      {
        provide: Car,
        useFactory: (container: Container) =>
          new SportsCar(container.get(Engine)),
      },
    ]);
    const car = container.get<Car>(Car);

    expect(car).toBeInstanceOf(SportsCar);
    expect(car.engine).toBeInstanceOf(Engine);
  });

  it('should support optional dependencies', () => {
    const container = createContainer([
      {
        provide: CarWithOptionalEngine,
        useFactory: (container: Container) => new CarWithOptionalEngine(null),
      },
    ]);
    const car = container.get<CarWithOptionalEngine>(CarWithOptionalEngine);

    expect(car.engine).toEqual(null);
  });

  it('should use the last provider when there are multiple providers for same token', () => {
    const container = createContainer([
      { provide: Engine, useClass: Engine },
      { provide: Engine, useClass: TurboEngine },
    ]);

    expect(container.get(Engine)).toBeInstanceOf(TurboEngine);
  });

  it('should resolve when chain dependencies', () => {
    const container = createContainer([
      {
        provide: CarWithDashboard,
        useFactory: (container: Container) =>
          new CarWithDashboard(container.get(Engine), container.get(Dashboard)),
      },
      { provide: Engine, useClass: Engine },
      {
        provide: Dashboard,
        useFactory: (container: Container) =>
          new Dashboard(container.get(DashboardSoftware)),
      },
      { provide: DashboardSoftware, useClass: DashboardSoftware },
    ]);
    const car = container.get<CarWithDashboard>(CarWithDashboard);

    expect(car).toBeInstanceOf(CarWithDashboard);
    expect(car.engine).toBeInstanceOf(Engine);
    expect(car.dashboard).toBeInstanceOf(Dashboard);
  });

  it('should throw when missing chain dependencies', () => {
    const container = createContainer([
      {
        provide: CarWithDashboard,
        useFactory: (container: Container) =>
          new CarWithDashboard(container.get(Engine), container.get(Dashboard)),
      },
      { provide: Engine, useClass: Engine },
      {
        provide: Dashboard,
        useFactory: (container: Container) =>
          new Dashboard(container.get(DashboardSoftware)),
      },
      // missing 'DashboardSoftware'
    ]);

    expect(() => container.get(CarWithDashboard)).toThrowError(
      'Unable to resolve service',
    );
  });

  it('should throw when cyclic aliases detetected', () => {
    try {
      createContainer([
        { provide: Engine, useClass: Engine },
        { provide: Engine, useClass: TurboEngine },
        { provide: TurboEngine, useExisting: TurboEngine },
      ]);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error.message).toBe('A cycle has been detected');
    }
  });

  it('should return true when provider exist', () => {
    const container = createContainer([
      { provide: String, useValue: 'Hello' },
      { provide: Engine, useClass: Engine },
      {
        provide: SportsCar,
        useFactory: (container: Container) =>
          new SportsCar(container.get(Engine)),
      },
      { provide: Car, useExisting: SportsCar },
    ]);

    expect(container.has(String)).toBe(true); // service
    expect(container.has(Engine)).toBe(true); // class
    expect(container.has(SportsCar)).toBe(true); // factory
    expect(container.has(Car)).toBe(true); // alias
  });

  it('should return false when provider does not exist', () => {
    const container = createContainer([]);

    expect(container.has('NonExisting')).toBe(false);
  });

  it('shoul fail to instantiate when error happens in a constructor', () => {
    try {
      createContainer([{ provide: Engine, useClass: BrokenEngine }]);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error.message).toContain('Broken Engine');
    }
  });

  it('should add a single value provider', () => {
    const container = createContainer([]);
    container.addProvider({ provide: String, useValue: 'Hello' });

    expect(container.get(String)).toEqual('Hello');
  });

  it('should add a single class provider', () => {
    const container = createContainer([]);
    container.addProvider({ provide: Engine, useClass: TurboEngine });
    const engine: Engine = container.get(Engine);

    expect(engine instanceof TurboEngine).toBe(true);
  });

  it('should add a single factory provider', () => {
    const container = createContainer([]);
    container.addProvider({
      provide: Engine,
      useClass: Engine,
    });
    container.addProvider({
      provide: Car,
      useFactory: (container: Container) =>
        new SportsCar(container.get(Engine)),
    });
    const car: Car = container.get(Car);

    expect(car instanceof SportsCar).toBe(true);
  });

  it('should add a single alias provider', () => {
    const container = createContainer([]);
    container.addProvider({
      provide: TurboEngine,
      useClass: TurboEngine,
    });
    container.addProvider({
      provide: Engine,
      useExisting: TurboEngine,
    });

    expect(container.get(Engine)).toBe(container.get(TurboEngine));
  });

  it('should throw when given invalid single provider', () => {
    expect(() => createContainer([]).addProvider(<any>'blah')).toThrowError(
      'Invalid provider definition',
    );
  });

  it('should use non-type tokens', () => {
    const container = createContainer([
      { provide: 'token', useValue: 'value' },
    ]);

    expect(container.get('token')).toEqual('value');
  });

  it('should throw when given invalid providers', () => {
    expect(() => createContainer(<any>['blah'])).toThrowError(
      'Invalid provider definition',
    );
  });

  it('should throw when no provider defined', () => {
    const container = createContainer([]);

    expect(() => container.get('NonExisting')).toThrowError(
      'Unable to resolve service',
    );
  });
});
