import express, { json, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { userRoutes, authRoutes } from './routes';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@vtex-tickets/common';

dotenv.config();

console.log('Environment variables: ', { mode: process.env.NODE_ENV });

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'dev' ? false : true,
  }),
);

const routerPrefix = '/api/users';

app.get('/_status/healthz', (_req, res) => {
  return res.status(200).send({});
});

app.use(`${routerPrefix}`, [userRoutes, authRoutes]);

app.all('*', (_req: Request, _res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
