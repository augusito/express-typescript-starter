export const NO_SCHEDULER_FOUND = (schedulerName: string, name?: string) =>
  name
    ? `No ${schedulerName} was found with the given name (${name}).`
    : `No ${schedulerName} was found. Check your configuration.`;

export const DUPLICATE_SCHEDULER = (schedulerName: string, name: string) =>
  `${schedulerName} with the given name (${name}) already exists. Ignored.`;

export const MISSING_DEPENDENCY = (name: string) =>
  `Cannot fetch scheduler service (${name}); service not registered, or does not resolve to a callable.`;

export const INVALID_SCHEDULER = (name: string) =>
  `Invalid scheduler service (${name}); service doesn't provide the 'execute' method.`;

export const INVALID_ClASS = (name: string) =>
  `Invalid scheduler class (${name}); expected a defult (no-argument) constructor.`;
