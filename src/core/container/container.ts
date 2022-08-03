import {
  ExistingProvider,
  Factory,
  FactoryProvider,
  IContainer,
  Provider,
  ProviderToken,
  ValueProvider,
} from './interfaces';
import { isUndefined } from '../utils/lang.util';
import { isType } from './utils';

export default class Container implements IContainer {
  private readonly services = new Map<ProviderToken, any>();
  private readonly factories = new Map<ProviderToken, Factory<any>>();
  private readonly aliases = new Map<ProviderToken, any>();
  protected isInitialized = false;

  /**
   * Create a new Container instance.
   * @param providers the providers to initialize
   */
  constructor(providers?: Provider[]) {
    this.initialize(providers);
  }

  /**
   * Initialize the given container.
   * @param providers the providers to initialize
   * @returns the initialized container instance
   * @throws TypeError if an invalid provider definition
   */
  public initialize(providers: Provider[]): Container {
    let newAliases = false;
    for (const provider of providers) {
      if (this.isValueProvider(provider)) {
        this.services.set(provider.provide, provider.useValue);
      } else if (this.isFactoryProvider(provider)) {
        this.factories.set(provider.provide, provider.useFactory);
      } else if (this.isExistingProvider(provider)) {
        this.aliases.set(provider.provide, provider.useExisting);
        newAliases = true;
      } else {
        throw new TypeError('Invalid provider definition');
      }
    }
    if (newAliases) {
      this.mapAliasesToTargets();
    } else if (!this.isInitialized && newAliases) {
      this.mapAliasesToTargets();
    }
    this.isInitialized = true;
    return this;
  }

  /**
   * Find an entry of the container based on the provided token.
   * @param token the provider token of the entry to look for
   * @returns an entry from the container if defined
   */
  public get<T>(token: ProviderToken): T {
    if (this.services.has(token)) {
      return this.services.get(token);
    }
    if (this.aliases.size === 0) {
      const object = this.doCreate(token);
      this.services.set(token, object);
      return object;
    }
    const resolvedToken = this.aliases.get(token) ?? token;
    if (this.services.has(token)) {
      const object = this.services.get(resolvedToken);
      this.services.set(token, object);
      return object;
    }
    const object = this.doCreate(resolvedToken);
    this.services.set(resolvedToken, object);
    this.services.set(token, object);
    return object;
  }

  /**
   * Actually create a new service instance for the provider token.
   * @param token the provider token of the requested service
   * @returns the actual service instance that should be injected
   * @throws Error if a service could not be created
   */
  private doCreate(token: ProviderToken) {
    let object: any;
    try {
      const factory = this.getFactory(token);
      object = factory(this);
    } catch (error) {
      throw new Error(`Error creating service: ${error.message}`);
    }
    return object;
  }

  /**
   * Return the factory function that matches the given provider token, if any.
   * @param token the provider token of the factory to retrieve
   * @returns the factory function to create the service instance
   * @throws Error if there is no service with the given provider token
   */
  private getFactory(token: ProviderToken): Factory {
    const factory = this.factories.get(token) ?? null;
    if (factory === null) {
      throw new Error('Unable to resolve service');
    }
    if (isType(factory)) {
      return factory;
    }
    return factory;
  }

  /**
   * Check if the given provider is a value provider.
   * @param provider the provider to check
   * @returns whether the given provider is a value provider
   */
  public isValueProvider(provider: Provider): provider is ValueProvider {
    return !isUndefined((provider as ValueProvider).useValue);
  }

  /**
   * Check if the given provider is a factory provider.
   * @param provider the provider to check
   * @returns whether the given provider is a factory provider
   */
  public isFactoryProvider(provider: Provider): provider is FactoryProvider {
    return !isUndefined((provider as FactoryProvider).useFactory);
  }

  /**
   * Check if the given provider is an alias provider.
   * @param provider the provider to check
   * @returns whether the given provider is an alias provider
   */
  public isExistingProvider(provider: Provider): provider is ExistingProvider {
    return !isUndefined((provider as ExistingProvider).useExisting);
  }

  /**
   * Map aliases to targer services en masse for optimal performance.
   *
   * This method maps this.aliases in place.
   *
   * The algorithm is an adaptated version of Tarjans Strongly
   * Connected Components. Instead of returning the strongly
   * connected components (i.e. cycles in this case), we throw.
   * If nodes are not strongly connected (i.e. resolvable in
   * this case), they get resolved.
   */
  private mapAliasesToTargets(): void {
    const tagged = new Map<any, any>();
    for (const alias of this.aliases.keys()) {
      if (tagged.has(alias)) {
        continue;
      }
      let tCursor = this.aliases.get(alias);
      let aCursor = alias;
      if (aCursor === tCursor) {
        throw new Error('A cycle has been detected');
      }
      if (!this.aliases.has(tCursor)) {
        continue;
      }
      const stack = [];
      while (this.aliases.has(tCursor)) {
        stack.push(aCursor);
        if (aCursor === this.aliases.get(tCursor)) {
          throw new Error('A cycle has been detected');
        }
        aCursor = tCursor;
        tCursor = this.aliases.get(tCursor);
      }
      tagged.set(aCursor, true);
      for (const alias of stack) {
        if (alias === tCursor) {
          throw new Error('A cycle has been detected');
        }
        this.aliases.set(alias, tCursor);
        tagged.set(alias, true);
      }
    }
  }
}
