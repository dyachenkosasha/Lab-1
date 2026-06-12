import { Request, Response, NextFunction } from "express";
import service from "../services/comments.service";
import { validateCreateComment, validateUpdateComment } from "../dtos/comments.dto";

export const getByRequestId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestId = Number(req.params.requestId);
    if (!Number.isFinite(requestId)) {
      return res.status(400).json({ error: "requestId must be a number" });
    }
    const comments = await service.getByRequestId(requestId);
    res.json({ data: comments });
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestId = Number(req.params.requestId);
    if (!Number.isFinite(requestId)) {
      return res.status(400).json({ error: "requestId must be a number" });
    }
    const errors = validateCreateComment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(", ") });
    }
    const { userId, body } = req.body;
    const comment = await service.create(requestId, Number(userId), body);
    res.status(201).json({ data: comment });
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }
    const errors = validateUpdateComment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(", ") });
    }
    const comment = await service.update(id, req.body.body);
    res.json({ data: comment });
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }
    await service.delete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
