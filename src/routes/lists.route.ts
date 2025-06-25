import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createList, getAllLists, getSingleList, renameList } from "../controllers/lists.controller";
import { validateListCreationBody, validateListNameUpdateBody } from "../middlewares/lists.middleware";


const router = Router();

router.use(auth);

router.post("/", validateListCreationBody, createList);
router.get("/", getAllLists);
router.get("/:listId", getSingleList);
router.patch("/:listId", validateListNameUpdateBody, renameList)

export { router as listsRouter };