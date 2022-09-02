import { encode } from './utils';
import { COLORS } from './constants';
import { ColorOptions } from './interfaces';

export const color: Partial<ColorOptions> = {};

for (const [key, val] of Object.entries(COLORS)) {
  color[key] = (text: string): string => encode(val[0]) + text + encode(val[1]);
}
