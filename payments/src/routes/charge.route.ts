import { body, param } from "express-validator";
import express, { type Request, type Response } from "express";
import {
  currentUser,
  requireAuth,
  validateRequest,
} from "@vtex-tickets/common";
import { asyncHandler } from "../utils/async-handler";
import { orderService } from "../domain/services/order.service";

const router = express.Router();

// /api/payments

router.post(
  "/:orderId/charge",
  currentUser,
  requireAuth,
  [
    param("orderId").trim().notEmpty().withMessage("OrderId is required"),
    body("token").notEmpty().withMessage("Token is required"),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    await orderService.charge({
      orderId: req.params.orderId,
      token: req.body.token,
      userId: req.user!.id,
    });

    return res.status(201).send({
      message: "Charge created",
    });
  })
);

export default router;
