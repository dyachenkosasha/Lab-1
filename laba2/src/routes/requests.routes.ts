import { Router } from "express";
import { getAll, 
    getById, 
    getWithAuthors, 
    getStats, 
    search, 
    getBySeverity, // імпорт нового контролера  
    create, 
    update, 
    remove 
} from "../controllers/requests.controller";
import { getByRequestId, create as createComment } from "../controllers/comments.controller";

const router = Router();

router.get("/with-authors", getWithAuthors);
router.get("/stats", getStats);
router.get("/search", search);
//додано маршрут для фільтрації по severity
router.get("/severity/:severity", getBySeverity);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

router.get("/:requestId/comments", getByRequestId);
router.post("/:requestId/comments", createComment);

export default router;