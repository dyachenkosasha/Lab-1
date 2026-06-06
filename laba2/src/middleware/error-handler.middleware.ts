import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }

  const msg = String(err?.message ?? err);

  if (msg.includes("UNIQUE constraint failed")) {
    return res.status(409).json({ error: "Unique constraint violation: " + msg });
  }

  if (
    msg.includes("NOT NULL constraint failed") ||
    msg.includes("CHECK constraint failed")
  ) {
    return res.status(400).json({ error: "Invalid data: " + msg });
  }

  if (msg.includes("FOREIGN KEY constraint failed")) {
    return res.status(409).json({ error: "Cannot perform this action due to related records" });
  }

  console.error("[ERROR]", err);
  res.status(500).json({ error: "Internal Server Error" });
}