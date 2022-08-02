import { Factory } from './factory.interface';

/**
 * Configures the `Container` to return a value for a token.
 */
export interface ValueProvider<T = any> {
  /**
   * A provider token. Typically an instance of `Type` or`ProviderToken`,
   * but can be `any`.
   */
  provide: any;
  /**
   * The value to inject.
   */
  useValue: T;
}

/**
 * Configures the `Container` to return a value by invoking a `useFactory` function.
 */
export interface FactoryProvider<T = any> {
  /**
   * A provider token. Typically an instance of `ProviderToken`, but can be `any`.
   */
  provide: any;
  /**
   * A function to invoke to create an instance for this `token`. The function is
   * invoked with resolved values of token`s from an instance of the container.
   */
  useFactory: Factory<T>;
}

/**
 * Configures the `Container` to return a value of another `useExisting` token.
 */
export interface ExistingProvider<T = any> {
  /**
   * A provider token. Typically an instance of `ProviderToken`, but can be `any`.
   */
  provide: any;

  /**
   * Existing `token` to return.
   */
  useExisting: T;
}

export type Provider<T = any> =
  | ValueProvider<T>
  | FactoryProvider<T>
  | ExistingProvider<T>;
