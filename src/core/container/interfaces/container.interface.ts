import { ProviderToken } from './provider-token.interface';

/**
 * Describes the interface of a container that exposes methods to read its entries.
 */
export interface IContainer {
  /**
   * Find an entry of the container based on the provided token.
   * @param token the provider token to find an entry
   * @returns an entry from the container if defined
   * @throws NotFoundException if no entry was found for the token
   * @throws ContainerException if error while retrieving the entry
   */
  get<T>(token: ProviderToken): T;
}
