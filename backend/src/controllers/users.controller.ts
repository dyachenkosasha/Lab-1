import { Request, Response, NextFunction } from "express";
import service from "../services/users.service";
import { validateCreateUser, validateUpdateUser } from "../dtos/users.dto";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await service.getAll();
    res.json({ data: users });
  } catch (err) { next(err); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "id must be a number" });
    const user = await service.getById(id);
    res.json({ data: user });
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validateCreateUser(req.body);
    if (errors.length > 0) return res.status(400).json({ error: errors.join(", ") });
    const { email, name } = req.body;
    const user = await service.create(email, name);
    res.status(201).json({ data: user });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "id must be a number" });
    const errors = validateUpdateUser(req.body);
    if (errors.length > 0) return res.status(400).json({ error: errors.join(", ") });
    const user = await service.update(id, req.body.name);
    res.json({ data: user });
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "id must be a number" });
    await service.delete(id);
    res.status(204).send();
  } catch (err) { next(err); }
};
// Новий контролер для отримання топ 7 коментаторів
export const getTopCommenters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await service.getTopCommenters();
    res.json({ data: users });
  } catch (err) { next(err); }
};