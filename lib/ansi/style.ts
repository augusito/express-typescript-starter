import { encode } from './utils';
import { STYLES } from './constants';
import { StyleOptions } from './interfaces';

export const style: Partial<StyleOptions> = {};

for (const [key, val] of Object.entries(STYLES)) {
  style[key] = (text: string): string => encode(val[0]) + text + encode(val[1]);
}
