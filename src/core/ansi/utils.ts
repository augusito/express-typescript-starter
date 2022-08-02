import { AnsiColor } from './ansi-color.enum';
import { AnsiStyle } from './ansi-style.enum';
import { ENCODE_END, ENCODE_START } from './constants';

/**
 * Checks whether the ansi color is allowed.
 * @returns true if ansi color is allowed
 */
export const isColorAllowed = () => !process.env.NO_COLOR;

/**
 * Encode a single element if color is allowed.
 * @param element the element to encode
 * @returns the encoded element or an empty string
 */
export const encode = (element: AnsiColor | AnsiStyle) => {
  if (isColorAllowed()) {
    return ENCODE_START + element + ENCODE_END;
  }
  return '';
};
