import { Request, Response, NextFunction } from "express";
export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err.status && err.message) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  const msg = String(err?.message ?? err);
  const isDev = process.env.NODE_ENV !== "production";

  console.error("[ERROR]", err);

  if (msg.includes("UNIQUE constraint failed")) {
    res.status(409).json({ error: "Conflict: this record already exists" });
    return;
  }

  if (
    msg.includes("NOT NULL constraint failed") ||
    msg.includes("CHECK constraint failed")
  ) {
    res.status(400).json({ error: "Bad Request: invalid data" });
    return;
  }

  if (msg.includes("FOREIGN KEY constraint failed")) {
    res.status(409).json({ error: "Conflict: related records exist" });
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    ...(isDev && { detail: msg }),
  });
}
