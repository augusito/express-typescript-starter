import {
  json as bodyParserJson,
  Options,
  OptionsJson,
  OptionsUrlencoded,
  urlencoded as bodyParserUrlencoded,
} from 'body-parser';
import * as cors from 'cors';
import type { IncomingMessage, ServerResponse } from 'http';
import { Application } from '../lib/application';

// body-parser options
type RawBodyRequest<T> = T & { rawBody?: Buffer };

const rawBodyParser = (
  req: RawBodyRequest<IncomingMessage>,
  _res: ServerResponse,
  buffer: Buffer,
) => {
  if (Buffer.isBuffer(buffer)) {
    req.rawBody = buffer;
  }
  return true;
};

function getBodyParserOptions<ParserOptions extends Options>(
  rawBody: boolean,
  options?: ParserOptions | undefined,
): ParserOptions {
  let parserOptions: ParserOptions = options ?? ({} as ParserOptions);
  if (rawBody === true) {
    parserOptions = {
      ...parserOptions,
      verify: rawBodyParser,
    };
  }
  return parserOptions;
}

const bodyParserJsonOptions = getBodyParserOptions<OptionsJson>(true);
const bodyParserUrlencodedOptions = getBodyParserOptions<OptionsUrlencoded>(
  true,
  { extended: true },
);

// cors options
const corsOptions: cors.CorsOptions | cors.CorsOptionsDelegate<any> = {};

export default (app: Application) => {
  app.use(bodyParserJson(bodyParserJsonOptions));
  app.use(bodyParserUrlencoded(bodyParserUrlencodedOptions));
  app.use(cors(corsOptions));
};
