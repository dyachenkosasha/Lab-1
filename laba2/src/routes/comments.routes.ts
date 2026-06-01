import { Router } from "express";
import { remove } from "../controllers/comments.controller";

const router = Router();

router.delete("/:id", remove);

export default router;