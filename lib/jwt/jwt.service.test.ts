import * as jwt from 'jsonwebtoken';

import { JwtOptions, JwtRequestType, JwtService } from './jwt.service';

const setup = async (config: JwtOptions) => {
  return new JwtService(config);
};

const config = {
  secretOrKeyProvider: (requestType: JwtRequestType) =>
    requestType === JwtRequestType.SIGN ? 'sign_secret' : 'verify_secret',
  secret: 'default_secret',
  publicKey: 'public_key',
  privateKey: 'private_key',
};

describe('JWT Service', () => {
  let verifySpy: jest.SpyInstance;
  let signSpy: jest.SpyInstance;
  const getRandomString = () => `${Date.now()}`;

  beforeEach(async () => {
    signSpy = jest
      .spyOn(jwt, 'sign')
      .mockImplementation((token, secret, options, callback) => {
        const result = 'signed_' + token + '_by_' + secret;
        return callback ? callback(null, result) : result;
      });

    verifySpy = jest
      .spyOn(jwt, 'verify')
      .mockImplementation((token, secret, options, callback) => {
        const result = 'verified_' + token + '_by_' + secret;
        return callback ? callback(null, result as any) : result;
      });
  });

  afterEach(() => {
    verifySpy.mockRestore();
    signSpy.mockRestore();
  });

  describe('should use config.secretOrKeyProvider', () => {
    let jwtService: JwtService;
    const testPayload: string = getRandomString();

    beforeAll(async () => {
      jwtService = await setup(config);
    });

    it('signing should use config.secretOrKeyProvider', async () => {
      expect(await jwtService.sign(testPayload)).toBe(
        `signed_${testPayload}_by_sign_secret`,
      );
    });

    it('signing (async) should use config.secretOrKeyProvider', async () => {
      await expect(jwtService.signAsync(testPayload)).resolves.toBe(
        `signed_${testPayload}_by_sign_secret`,
      );
    });

    it('verifying should use config.secretOrKeyProvider', async () => {
      expect(await jwtService.verify(testPayload)).toBe(
        `verified_${testPayload}_by_verify_secret`,
      );
    });

    it('verifying (async) should use config.secretOrKeyProvider', async () => {
      await expect(jwtService.verifyAsync(testPayload)).resolves.toBe(
        `verified_${testPayload}_by_verify_secret`,
      );
    });
  });

  describe('should use config.secret', () => {
    let jwtService: JwtService;
    const testPayload: string = getRandomString();

    beforeAll(async () => {
      jwtService = await setup({ ...config, secretOrKeyProvider: undefined });
    });

    it('signing should use config.secret', async () => {
      expect(await jwtService.sign(testPayload)).toBe(
        `signed_${testPayload}_by_default_secret`,
      );
    });

    it('signing (async) should use config.secret', async () => {
      await expect(jwtService.signAsync(testPayload)).resolves.toBe(
        `signed_${testPayload}_by_default_secret`,
      );
    });

    it('verifying should use config.secret', async () => {
      expect(await jwtService.verify(testPayload)).toBe(
        `verified_${testPayload}_by_default_secret`,
      );
    });

    it('verifying (async) should use config.secret', async () => {
      await expect(jwtService.verifyAsync(testPayload)).resolves.toBe(
        `verified_${testPayload}_by_default_secret`,
      );
    });
  });

  describe('should use config.privateKey and config.publicKey', () => {
    let jwtService: JwtService;
    const testPayload: string = getRandomString();

    beforeAll(async () => {
      jwtService = await setup({
        ...config,
        secretOrKeyProvider: undefined,
        secret: undefined,
      });
    });

    it('signing should use config.privateKey', async () => {
      expect(await jwtService.sign(testPayload)).toBe(
        `signed_${testPayload}_by_private_key`,
      );
    });

    it('signing (async) should use config.privateKey', async () => {
      await expect(jwtService.signAsync(testPayload)).resolves.toBe(
        `signed_${testPayload}_by_private_key`,
      );
    });

    it('verifying should use config.publicKey', async () => {
      expect(await jwtService.verify(testPayload)).toBe(
        `verified_${testPayload}_by_public_key`,
      );
    });

    it('verifying (async) should use config.publicKey', async () => {
      await expect(jwtService.verifyAsync(testPayload)).resolves.toBe(
        `verified_${testPayload}_by_public_key`,
      );
    });
  });

  describe('should allow buffers for secrets', () => {
    let jwtService: JwtService;
    let secretB64: Buffer;
    const testPayload = { foo: 'bar' };

    beforeEach(async () => {
      secretB64 = Buffer.from('ThisIsARandomSecret', 'base64');
      jwtService = await setup({ secret: secretB64 });
      verifySpy.mockRestore();
      signSpy.mockRestore();
    });

    it('verifying should use base64 buffer key', async () => {
      const token = jwt.sign(testPayload, secretB64);

      expect(jwtService.verify(token)).toHaveProperty('foo', 'bar');
    });

    it('verifying (async) should use base64 buffer key', async () => {
      const token = jwt.sign(testPayload, secretB64);

      await expect(jwtService.verifyAsync(token)).resolves.toHaveProperty(
        'foo',
        'bar',
      );
    });
  });

  describe('should use secret key from options', () => {
    let jwtService: JwtService;
    const testPayload: string = getRandomString();

    beforeAll(async () => {
      jwtService = await setup({
        ...config,
        secretOrKeyProvider: undefined,
      });
    });

    const secret = 'custom_secret';

    it('signing should use secret key from options', async () => {
      expect(await jwtService.sign(testPayload, { secret })).toBe(
        `signed_${testPayload}_by_custom_secret`,
      );
    });

    it('signing (async) should use secret key from options', async () => {
      await expect(jwtService.signAsync(testPayload, { secret })).resolves.toBe(
        `signed_${testPayload}_by_custom_secret`,
      );
    });

    it('verifying should use secret key from options', async () => {
      expect(await jwtService.verify(testPayload, { secret })).toBe(
        `verified_${testPayload}_by_custom_secret`,
      );
    });

    it('verifying (async) should use secret key from options', async () => {
      await expect(
        jwtService.verifyAsync(testPayload, { secret }),
      ).resolves.toBe(`verified_${testPayload}_by_custom_secret`);
    });
  });

  describe('should use private/public key from options', () => {
    let jwtService: JwtService;
    const testPayload: string = getRandomString();

    beforeAll(async () => {
      jwtService = await setup({
        ...config,
        secretOrKeyProvider: undefined,
        secret: undefined,
      });
    });

    const privateKey = 'customPrivateKey';
    const publicKey = 'customPublicKey';

    it('signing should use private key from options', async () => {
      expect(await jwtService.sign(testPayload, { privateKey })).toBe(
        `signed_${testPayload}_by_customPrivateKey`,
      );
    });

    it('signing (async) should use private key from options', async () => {
      await expect(
        jwtService.signAsync(testPayload, { privateKey }),
      ).resolves.toBe(`signed_${testPayload}_by_customPrivateKey`);
    });

    it('verifying should use public key from options', async () => {
      expect(await jwtService.verify(testPayload, { publicKey })).toBe(
        `verified_${testPayload}_by_customPublicKey`,
      );
    });

    it('verifying (async) should use public key from options', async () => {
      await expect(
        jwtService.verifyAsync(testPayload, { publicKey }),
      ).resolves.toBe(`verified_${testPayload}_by_customPublicKey`);
    });
  });
});
