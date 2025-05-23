import express, { json, type Request, type Response } from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@vtex-tickets/common";
import { adminTicketRoutes, ticketRoutes } from "./routes";

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, // disabled because we are not using https at the moment
  }),
);

app.get("/_status/healthz", (_req, res) => {
  return res.status(200).send({});
});

app.use("/api/tickets/admin", [adminTicketRoutes]);
// app.use("/api/tickets", [ticketRoutes]);

app.all("*", (_req: Request, _res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
