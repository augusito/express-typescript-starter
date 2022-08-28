import {
  json as bodyParserJson,
  OptionsJson,
  OptionsUrlencoded,
  urlencoded as bodyParserUrlencoded,
} from 'body-parser';
import * as cors from 'cors';
import { getBodyParserOptions } from '../src/core/http/utils';
import { Application } from '../src/core/application';

const bodyParserJsonOptions = getBodyParserOptions<OptionsJson>(true);
const bodyParserUrlencodedOptions = getBodyParserOptions<OptionsUrlencoded>(
  true,
  { extended: true },
);

const corsOptions: cors.CorsOptions | cors.CorsOptionsDelegate<any> = {};

export default (app: Application) => {
  app.use(bodyParserJson(bodyParserJsonOptions));
  app.use(bodyParserUrlencoded(bodyParserUrlencodedOptions));
  app.use(cors(corsOptions));
};
