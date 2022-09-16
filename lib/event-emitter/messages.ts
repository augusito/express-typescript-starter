export const MISSING_DEPENDENCY = (name: string) =>
  `Cannot fetch listener service (${name}); service not registered, or doesn't resolve to a callable.`;

export const INVALID_EVENT = (name: string) =>
  `Invalid listener service (${name}); service doesn't provide the 'execute' method.`;
