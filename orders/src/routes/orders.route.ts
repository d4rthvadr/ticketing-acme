import { currentUser, requireAuth, validateRequest } from "@vtex-tickets/common";
import express, { type Request, type Response } from "express";
import { body } from "express-validator";
import { asyncHandler } from "../utils/async-handler";
import { orderService } from "../domain/services/order.service";
import { OrderDocument } from "../domain/models/order.model";

const router = express.Router();

// api/orders
router.get(
  "/",
  currentUser,
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders: OrderDocument[] = await orderService.list(req.user.id);
    return res.status(200).send(orders);
  }),
);

// api/orders/:id
router.get(
  "/:id",
  currentUser,
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orderId: string = req.params.id;

    const order: OrderDocument = await orderService.findById(orderId, req.user.id);

    return res.status(200).send(order);
  }),
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
  asyncHandler(async (req: Request, res: Response) => {
    const order: OrderDocument = await orderService.create({
      userId: req.user!.id,
      ticketId: req.body.ticketId,
    });

    return res.status(201).send(order);
  }),
);

// api/orders/:id/cancel
router.patch(
  "/:id/cancel",
  currentUser,
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orderId: string = req.params.id;
    const order = await orderService.cancel(orderId, req.user.id);
    return res.status(204).send(order);
  }),
);

// api/orders/:id
router.put(
  "/",
  currentUser,
  requireAuth,
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).send();
  }),
);

export default router;
