import { rateLimit } from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try later",
  },
});
