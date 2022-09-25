export default {
  jwtOptions: {
    secret: 'secretKey',
    signOptions: { expiresIn: '60s' },
  },
};
