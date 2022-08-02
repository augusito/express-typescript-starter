import { StyleOptions } from './interfaces';
import { ENCODE_END, ENCODE_START, STYLES } from './constants';
import { AnsiStyle } from './ansi-style.enum';
import { isAnsiAllowed } from './utils';

const encode = (element: AnsiStyle | string) => {
  if (isAnsiAllowed()) {
    return ENCODE_START + element + ENCODE_END;
  }
  return '';
};

export const style: Partial<StyleOptions> = {};

for (const [key, val] of Object.entries(STYLES)) {
  style[key] = (text: string): string => encode(val[0]) + text + encode(val[1]);
}
