/**
 * Checks whether the ansi color is allowed.
 * @returns true if ansi color is allowed
 */
export const isAnsiAllowed = () => !process.env.NO_COLOR;
