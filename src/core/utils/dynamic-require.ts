export default (request: any) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(request);
  return mod.__esModule && mod.default ? mod.default : mod;
};
