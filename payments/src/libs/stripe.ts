import Stripe from "stripe";
import { getEnv } from "../env";

const stripe = new Stripe(getEnv().STRIPE_SECRET, {
  apiVersion: "2025-02-24.acacia",
});

export { stripe };
