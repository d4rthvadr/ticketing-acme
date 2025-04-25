import { body } from "express-validator";
import express, { type Request, type Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@vtex-tickets/common";
import { adminTicketService } from "../domain/services/admin.ticket.service";
import { TicketDocument } from "../domain/models/ticket.model";
import { asyncHandler } from "../utils/async-handler";

const router = express.Router();

// /api/tickets/admin

router.get("/", currentUser, requireAuth, async (_req: Request, res: Response) => {
  const tickets: TicketDocument[] = await adminTicketService.list();

  return res.status(200).send(tickets);
});

// /admin/api/tickets/:id
router.get(
  "/:id",
  currentUser,
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const ticketId: string = req.params.id;

    const ticket: TicketDocument | null = await adminTicketService.findById(ticketId);

    return res.status(200).send(ticket);
  }),
);

// /api/tickets/admin
router.post(
  "/",
  currentUser,
  requireAuth,
  [
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than zero"),
    body("title").trim().notEmpty().withMessage("Title is required"),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket: TicketDocument = await adminTicketService.create({
      title,
      price,
      userId: req.user!.id,
    });

    return res.status(201).send(ticket);
  }),
);

// /api/tickets/admin/:id
router.put(
  "/:id",
  currentUser,
  requireAuth,
  [
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than zero"),
    body("title").trim().notEmpty().withMessage("Title is required"),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket: TicketDocument = await adminTicketService.update({
      id: req.params.id,
      title,
      price,
      userId: req.user!.id,
    });

    return res.status(201).send(ticket);
  }),
);

export default router;
