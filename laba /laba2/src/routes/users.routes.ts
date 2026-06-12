import { Router } from "express";
import { getAll, 
  getById,
   create, 
   update, 
   remove, 
   getTopCommenters // імпорт нового контролера 
  } from "../controllers/users.controller";

const router = Router();
// додано маршрут для топ 7 коментаторів 
router.get("/top-commenters", getTopCommenters);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;