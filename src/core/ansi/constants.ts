import { AnsiColor } from './ansi-color.enum';
import { AnsiStyle } from './ansi-style.enum';

export const ENCODE_JOIN = ';';
export const ENCODE_START = '\u001B[';
export const ENCODE_END = 'm';

export const COLORS = {
  black: [AnsiColor.BLACK, AnsiColor.DEFAULT],
  red: [AnsiColor.RED, AnsiColor.DEFAULT],
  green: [AnsiColor.GREEN, AnsiColor.DEFAULT],
  yellow: [AnsiColor.YELLOW, AnsiColor.DEFAULT],
  blue: [AnsiColor.BLUE, AnsiColor.DEFAULT],
  magenta: [AnsiColor.MAGENTA, AnsiColor.DEFAULT],
  cyan: [AnsiColor.CYAN, AnsiColor.DEFAULT],
  white: [AnsiColor.WHITE, AnsiColor.DEFAULT],
  blackBright: [AnsiColor.BRIGHT_BLACK, AnsiColor.DEFAULT],
  redBright: [AnsiColor.BRIGHT_RED, AnsiColor.DEFAULT],
  greenBright: [AnsiColor.BRIGHT_GREEN, AnsiColor.DEFAULT],
  yellowBright: [AnsiColor.BRIGHT_YELLOW, AnsiColor.DEFAULT],
  blueBright: [AnsiColor.BRIGHT_BLUE, AnsiColor.DEFAULT],
  magentaBright: [AnsiColor.BRIGHT_MAGENTA, AnsiColor.DEFAULT],
  cyanBright: [AnsiColor.BRIGHT_CYAN, AnsiColor.DEFAULT],
  whiteBright: [AnsiColor.BRIGHT_WHITE, AnsiColor.DEFAULT],
} as const;

export const STYLES = {
  normal: [AnsiStyle.NORMAL, AnsiStyle.NORMAL],
  bold: [AnsiStyle.BOLD, AnsiStyle.NORMAL],
  faint: [AnsiStyle.FAINT, AnsiStyle.NORMAL],
  italic: [AnsiStyle.ITALIC, AnsiStyle.NORMAL],
  underline: [AnsiStyle.UNDERLINE, AnsiStyle.NORMAL],
} as const;
