import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many login attempts, try agin later ",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {};
