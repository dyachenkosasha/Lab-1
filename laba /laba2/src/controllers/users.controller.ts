import { Request, Response } from "express";

import service from "../services/users.service";

export const getAll = (
  req: Request,
  res: Response
) => {
  const items = service.getAll();

  res.json({ items });
};

export const create = (
  req: Request,
  res: Response
) => {
  const user = service.create(req.body);

  res.status(201).json(user);
};