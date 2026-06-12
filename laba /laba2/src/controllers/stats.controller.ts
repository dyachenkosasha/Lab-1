import { Request, Response, NextFunction } from "express";
import statsService from "../services/stats.service";

export const getTopCommenters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const severity = Number(req.params.severity);
    const result = await statsService.getTopCommentersBySeverity(severity);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};
