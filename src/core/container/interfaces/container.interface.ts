import { ProviderToken } from './provider-token.interface';

/**
 * Describes the interface of a container that exposes methods to read its entries.
 */
export interface IContainer {
  /**
   * Find an entry of the container based on the provided token.
   *
   * @param token Identifier of the entry to look for.
   * @returns Entry from the container if defined.
   * @throws NotFoundException No entry was found for the identifier.
   * @throws ContainerException Error while retrieving the entry.
   */
  get<T>(token: ProviderToken): T;
}
