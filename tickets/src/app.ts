import express, { json, type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@vtex-tickets/common";
import { ticketRoutes } from "./routes";

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "dev" ? false : true,
  })
);

const routerPrefix = "/api/tickets";

app.get("/_status/healthz", (_req, res) => {
  return res.status(200).send({});
});

app.use(`${routerPrefix}`, [ticketRoutes]);

app.use(errorHandler);

app.all("*", (_req: Request, _res: Response) => {
  throw new NotFoundError();
});

export { app };
