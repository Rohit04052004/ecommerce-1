import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Stripe is optional until a real secret key is configured — payment routes
// check `stripe` for null and return a clear error instead of crashing.
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
