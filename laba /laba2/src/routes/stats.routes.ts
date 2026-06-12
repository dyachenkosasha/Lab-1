import { Router } from "express";
import { getTopCommenters } from "../controllers/stats.controller";

const router = Router();

router.get("/top-commenters/:severity", getTopCommenters);

export default router;
