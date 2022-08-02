import { ColorOptions } from './interfaces';
import { ENCODE_END, ENCODE_START, COLORS } from './constants';
import { AnsiColor } from './ansi-color.enum';
import { isAnsiAllowed } from './utils';

const encode = (element: AnsiColor) => {
  if (isAnsiAllowed()) {
    return ENCODE_START + element + ENCODE_END;
  }
  return '';
};

export const color: Partial<ColorOptions> = {};

for (const [key, val] of Object.entries(COLORS)) {
  color[key] = (text: string): string => encode(val[0]) + text + encode(val[1]);
}
