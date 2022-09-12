export const NO_SCHEDULER_FOUND = (schedulerName: string, name?: string) =>
  name
    ? `No ${schedulerName} was found with the given name (${name}).`
    : `No ${schedulerName} was found. Check your configuration.`;

export const DUPLICATE_SCHEDULER = (schedulerName: string, name: string) =>
  `${schedulerName} with the given name (${name}) already exists. Ignored.`;
