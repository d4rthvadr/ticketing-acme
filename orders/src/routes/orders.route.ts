import {
  currentUser,
  requireAuth,
  validateRequest,
} from "@vtex-tickets/common";
import express, { type Request, type Response } from "express";
import { body } from "express-validator";

const router = express.Router();

// api/orders
router.get(
  "/",
  currentUser,
  requireAuth,
  async (_req: Request, res: Response) => {
    return res.status(200).send();
  }
);

// api/orders/:id
router.get(
  "/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId: string = req.params.id;

    return res.status(200).send();
  }
);

// api/orders
router.post(
  "/",
  currentUser,
  requireAuth,
  [
    // Note: skipping check for mongoose ObjectId type to allow system to be flexible when we change database
    body("ticketId").notEmpty().withMessage("TicketId is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    return res.status(200).send();
  }
);

// api/orders/:id
router.put(
  "/",
  currentUser,
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    return res.status(200).send();
  }
);

export default router;
