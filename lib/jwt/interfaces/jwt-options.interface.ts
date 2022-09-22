import * as jwt from 'jsonwebtoken';
import { JwtRequestType } from '../enums/jwt-request-type.enum';

export interface JwtOptions {
  signOptions?: jwt.SignOptions;
  secret?: string | Buffer;
  publicKey?: string | Buffer;
  privateKey?: jwt.Secret;
  secretOrKeyProvider?: (
    requestType: JwtRequestType,
    tokenOrPayload: string | object | Buffer,
    options?: jwt.VerifyOptions | jwt.SignOptions,
  ) => jwt.Secret;
  verifyOptions?: jwt.VerifyOptions;
}
