import { currentUser, requireAuth } from "@vtex-tickets/common";
import express, { type Request, type Response } from "express";

const router = express.Router();

// /api/tickets

router.get("/", currentUser, requireAuth, async (_req: Request, res: Response) => {
  return res.status(200).send([]);
});

export default router;
