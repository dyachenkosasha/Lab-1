import { Request, Response, NextFunction } from "express";
import { get } from "../db/dbClient";

interface UserRow {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export async function demoAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const rawId = req.header("X-Demo-UserId");

  if (!rawId) {
    res.status(401).json({ error: "Unauthorized: X-Demo-UserId header is required" });
    return;
  }

  const userId = Number(rawId);
  if (!Number.isFinite(userId) || userId <= 0) {
    res.status(401).json({ error: "Unauthorized: invalid user id" });
    return;
  }

  const user = await get<UserRow>(
    "SELECT id FROM Users WHERE id = ?",
    [userId]
  );

  if (!user) {
    res.status(401).json({ error: "Unauthorized: user not found" });
    return;
  }

  req.user = { id: user.id };
  next();
}
