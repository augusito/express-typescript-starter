import { CorsOptions, CorsOptionsDelegate } from 'cors';

export interface ApplicationOptions {
  /**
   * CORS configuration options
   */
  cors?: boolean | CorsOptions | CorsOptionsDelegate<any>;
  /**
   * Whether to use underlying platform body parser.
   */
  bodyParser?: boolean;
  /**
   * Set of configurable HTTPS options
   */
  httpsOptions?: any;
  /**
   * Whether to register the raw request body on the request. Use `req.rawBody`.
   */
  rawBody?: boolean;
}
