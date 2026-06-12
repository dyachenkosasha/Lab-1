import { Router } from "express";
import { remove, update } from "../controllers/comments.controller";

const router = Router();

router.put("/:id", update);
router.delete("/:id", remove);

export default router;
