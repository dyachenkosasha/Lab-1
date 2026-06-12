import { Router } from "express";
import {
  getAll,
  getById,
  getWithAuthors,
  getStats,
  search,
  getBySeverity,
  create,
  update,
  remove,
} from "../controllers/requests.controller";
import { getByRequestId, create as createComment } from "../controllers/comments.controller";
import { demoAuth } from "../middleware/demo-auth.middleware";

const router = Router();

router.get("/with-authors", getWithAuthors);
router.get("/stats", getStats);
router.get("/search", search);
router.get("/severity/:severity", getBySeverity);
router.get("/", getAll);
router.get("/:id", getById);
router.get("/:requestId/comments", getByRequestId);

router.post("/", demoAuth, create);
router.put("/:id", demoAuth, update);
router.delete("/:id", demoAuth, remove);

router.post("/:requestId/comments", demoAuth, createComment);

export default router;
