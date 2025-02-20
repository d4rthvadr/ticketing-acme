import process from 'node:process';

export const setUpEnv = () => {
  const { env } = process;
  process.env = {
    ...env,
    JWT_SECRET: 'secret',
    ENC_DEC_KEY: 'encDecKey',
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
  };
};
