import { Container } from './core/container';

(() => {
  console.log('Hello World!'); // Display the string.

  class Engine {}

  class Car {
    constructor(public engine: Engine) {}
  }

  class SportsCar extends Car {}

  const container = new Container([
    { provide: Engine, useValue: new Engine() },
    {
      provide: SportsCar,
      useFactory: (container: Container) =>
        new SportsCar(container.get(Engine)),
    },
    { provide: Car, useExisting: SportsCar },
  ]);

  const sportsCar = container.get<SportsCar>(SportsCar);
  const car = container.get<Car>(Car);

  console.log(sportsCar.engine);
  console.log(car.engine);
})();
