import * as jwt from 'jsonwebtoken';

export enum JwtSecretRequestType {
  SIGN,
  VERIFY,
}

export interface JwtModuleOptions {
  signOptions?: jwt.SignOptions;
  secret?: string | Buffer;
  publicKey?: string | Buffer;
  privateKey?: jwt.Secret;
  secretOrKeyProvider?: (
    requestType: JwtSecretRequestType,
    tokenOrPayload: string | object | Buffer,
    options?: jwt.VerifyOptions | jwt.SignOptions,
  ) => jwt.Secret;
  verifyOptions?: jwt.VerifyOptions;
}

export interface JwtOptionsFactory {
  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions;
}

export interface JwtSignOptions extends jwt.SignOptions {
  secret?: string | Buffer;
  privateKey?: string | Buffer;
}

export interface JwtVerifyOptions extends jwt.VerifyOptions {
  secret?: string | Buffer;
  publicKey?: string | Buffer;
}

export class JwtService {
  constructor(private readonly options: JwtModuleOptions = {}) {}

  sign(payload: string | Buffer | object, options?: JwtSignOptions): string {
    const signOptions = this.mergeJwtOptions(
      { ...options },
      'signOptions',
    ) as jwt.SignOptions;
    const secret = this.getSecretKey(
      payload,
      options,
      'privateKey',
      JwtSecretRequestType.SIGN,
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
      JwtSecretRequestType.SIGN,
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
      JwtSecretRequestType.VERIFY,
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
      JwtSecretRequestType.VERIFY,
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
    secretRequestType: JwtSecretRequestType,
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
