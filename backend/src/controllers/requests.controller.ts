import { Request, Response, NextFunction } from "express";
import service from "../services/requests.service";
import { validateCreateRequest, validateUpdateRequest } from "../dtos/requests.dto";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const status = req.query.status as string | undefined;
    const sort = req.query.sort as string | undefined;
    const order = req.query.order as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const requests = await service.getAll({ userId, status, sort, order, limit });
    res.json({ data: requests, meta: { count: requests.length } });
  } catch (err) { next(err); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "id must be a number" });
    const request = await service.getById(id);
    res.json({ data: request });
  } catch (err) { next(err); }
};

export const getWithAuthors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await service.getWithAuthors();
    res.json({ data: requests, meta: { count: requests.length } });
  } catch (err) { next(err); }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await service.getStatusCounts();
    res.json({ data: stats });
  } catch (err) { next(err); }
};

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q ?? "");
    const requests = await service.searchByTitle(q);
    res.json({ data: requests });
  } catch (err) { next(err); }
};
// контролер для отримання запитів за рівнем серйозності (severity) - новий
export const getBySeverity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const severity = Number(req.params.severity);
    if (!Number.isFinite(severity) || severity < 1 || severity > 5) {
      return res.status(400).json({ error: "severity must be between 1 and 5" });
    }
    const requests = await service.getBySeverity(severity);
    res.json({ data: requests, meta: { count: requests.length } });
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validateCreateRequest(req.body);
    if (errors.length > 0) return res.status(400).json({ error: errors.join(", ") });
    const { userId, title, severity, status } = req.body;
    const request = await service.create(Number(userId), title, Number(severity), status);
    res.status(201).json({ data: request });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "id must be a number" });
    const errors = validateUpdateRequest(req.body);
    if (errors.length > 0) return res.status(400).json({ error: errors.join(", ") });
    const { title, severity, status } = req.body;
    const request = await service.update(id, title, Number(severity), status);
    res.json({ data: request });
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