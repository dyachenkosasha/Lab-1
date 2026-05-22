import { Request, Response, NextFunction } from "express";

import service from "../services/requests.service";
import { validateRequest } from "../dtos/requests.dto";

export const getAll = (
  req: Request,
  res: Response
) => {
  const items = service.getAll();

  res.json({ items });
};

export const getById = (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const request = service.getById(id);

  res.json(request);
};

export const create = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validateRequest(req.body);

  if (errors.length > 0) {
    return next({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid data",
      details: errors
    });
  }

  const request = service.create(req.body);

  res.status(201).json(request);
};

export const update = (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const request = service.update(id, req.body);

  res.json(request);
};

export const remove = (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  service.delete(id);

  res.status(204).send();
};