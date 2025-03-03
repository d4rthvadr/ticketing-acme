import { body } from "express-validator";
import express, { type Request, type Response } from "express";
import { CastError } from "mongoose";
import {
  currentUser,
  requireAuth,
  validateRequest,
} from "@vtex-tickets/common";
import { TicketService } from "../domain/services/ticket.service";
import { TicketDocument } from "../domain/models/ticket.model";
import { asyncHandler } from "../utils/async-handler";

const ticketService = new TicketService();

const router = express.Router();

// /api/tickets

router.get(
  "/",
  currentUser,
  requireAuth,
  async (_req: Request, res: Response) => {
    const tickets: TicketDocument[] = await ticketService.list();

    return res.status(200).send(tickets);
  }
);

// /api/tickets/:id
router.get(
  "/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const ticketId: string = req.params.id;

    const ticket: TicketDocument | null =
      await ticketService.findById(ticketId);

    return res.status(200).send(ticket);
  }
);

// /api/tickets
router.post(
  "/",
  currentUser,
  requireAuth,
  [
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
    body("title").trim().notEmpty().withMessage("Title is required"),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket: TicketDocument = await ticketService.createTicket({
      title,
      price,
      userId: req.user!.id,
    });

    return res.status(201).send(ticket);
  })
);

// /api/tickets/:id
router.put(
  "/:id",
  currentUser,
  requireAuth,
  [
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
    body("title").trim().notEmpty().withMessage("Title is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket: TicketDocument = await ticketService.update({
      id: req.params.id,
      title,
      price,
      userId: req.user!.id,
    });

    return res.status(201).send(ticket);
  }
);

export default router;
