import { FormatTextFn } from './format-text-fn.interface';

export interface StyleOptions {
  normal: FormatTextFn;
  bold: FormatTextFn;
  faint: FormatTextFn;
  italic: FormatTextFn;
  underline: FormatTextFn;
}
