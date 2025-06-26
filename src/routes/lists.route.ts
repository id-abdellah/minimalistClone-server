import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createList, getAllLists, getSingleList, removeList, renameList } from "../controllers/lists.controller";
import { validateListCreationBody, validateListNameUpdateBody } from "../middlewares/lists.middleware";


const router = Router();

router.use(auth);

router.post("/", validateListCreationBody, createList);
router.get("/", getAllLists);
router.get("/:listId", getSingleList);
router.patch("/:listId", validateListNameUpdateBody, renameList);
router.delete("/:listId", removeList)

export { router as listsRouter };