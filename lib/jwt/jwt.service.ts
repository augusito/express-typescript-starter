import * as jwt from 'jsonwebtoken';
import { JwtOptions, JwtSignOptions, JwtVerifyOptions } from './interfaces';
import { JwtRequestType } from './enums/jwt-request-type.enum';

export class JwtService {
  constructor(private readonly options: JwtOptions = {}) {}

  sign(payload: string | Buffer | object, options?: JwtSignOptions): string {
    const signOptions = this.mergeJwtOptions(
      { ...options },
      'signOptions',
    ) as jwt.SignOptions;
    const secret = this.getSecretKey(
      payload,
      options,
      'privateKey',
      JwtRequestType.SIGN,
    );

    return jwt.sign(payload, secret, signOptions);
  }

  signAsync(
    payload: string | Buffer | object,
    options?: JwtSignOptions,
  ): Promise<string> {
    const signOptions = this.mergeJwtOptions(
      { ...options },
      'signOptions',
    ) as jwt.SignOptions;
    const secret = this.getSecretKey(
      payload,
      options,
      'privateKey',
      JwtRequestType.SIGN,
    );

    return new Promise((resolve, reject) =>
      jwt.sign(payload, secret, signOptions, (err, encoded) =>
        err ? reject(err) : resolve(encoded),
      ),
    );
  }

  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
    const verifyOptions = this.mergeJwtOptions({ ...options }, 'verifyOptions');
    const secret = this.getSecretKey(
      token,
      options,
      'publicKey',
      JwtRequestType.VERIFY,
    );

    return jwt.verify(token, secret, verifyOptions) as T;
  }

  verifyAsync<T extends object = any>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<T> {
    const verifyOptions = this.mergeJwtOptions({ ...options }, 'verifyOptions');
    const secret = this.getSecretKey(
      token,
      options,
      'publicKey',
      JwtRequestType.VERIFY,
    );

    return new Promise((resolve, reject) =>
      jwt.verify(token, secret, verifyOptions, (err, decoded) =>
        err ? reject(err) : resolve(decoded as T),
      ),
    ) as Promise<T>;
  }

  decode(
    token: string,
    options?: jwt.DecodeOptions,
  ): null | { [key: string]: any } | string {
    return jwt.decode(token, options);
  }

  private mergeJwtOptions(
    options: JwtVerifyOptions | JwtSignOptions,
    key: 'verifyOptions' | 'signOptions',
  ): jwt.VerifyOptions | jwt.SignOptions {
    delete options.secret;
    if (key === 'signOptions') {
      delete (options as JwtSignOptions).privateKey;
    } else {
      delete (options as JwtVerifyOptions).publicKey;
    }
    return options
      ? {
          ...(this.options[key] || {}),
          ...options,
        }
      : this.options[key];
  }

  private getSecretKey(
    token: string | object | Buffer,
    options: JwtVerifyOptions | JwtSignOptions,
    key: 'publicKey' | 'privateKey',
    secretRequestType: JwtRequestType,
  ): string | Buffer | jwt.Secret {
    const secret = this.options.secretOrKeyProvider
      ? this.options.secretOrKeyProvider(secretRequestType, token, options)
      : options?.secret ||
        this.options.secret ||
        (key === 'privateKey'
          ? (options as JwtSignOptions)?.privateKey || this.options.privateKey
          : (options as JwtVerifyOptions)?.publicKey ||
            this.options.publicKey) ||
        this.options[key];

    return secret;
  }
}
