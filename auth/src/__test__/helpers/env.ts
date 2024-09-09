import process from 'node:process';

const setUpEnv = () => {
  const { env } = process;
  process.env = {
    ...env,
    JWT_SECRET: 'jwtSecret',
  };
};

setUpEnv();
