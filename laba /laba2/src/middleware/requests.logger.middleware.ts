import { Request, Response, NextFunction } from "express";

export default function logger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", () => {
    const time = Date.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} -> ${res.statusCode} (${time}ms)`
    );
  });

  next();
}