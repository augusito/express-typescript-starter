import { Type } from './type.interface';
import { Abstract } from './abstract.interface';

/**
 * Token that can be used to retrieve an instance from a container.
 */
export type ProviderToken =
  | string
  | symbol
  | Type<any>
  | Abstract<any>
  | Function;
