import express, { json, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { userRoutes, authRoutes } from './routes';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@vtex-tickets/common';

dotenv.config();

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, // disabled because we are not using https at the moment
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
