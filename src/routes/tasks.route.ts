import { Router } from "express";
import { createTask, deleteTask, getAllTasks, toggleTaskCompletion, updateTaskContent } from "../controllers/tasks.controller";
import { auth } from "../middlewares/auth.middleware";
import { validateCreateTaskBody } from "../middlewares/tasks.middleware";


const router = Router();

router.use(auth);
router.post("/", validateCreateTaskBody, createTask);
router.get("/:listId", getAllTasks);
router.patch("/:taskId", updateTaskContent);
router.delete("/:taskId", deleteTask);
router.patch("/completed/:taskId", toggleTaskCompletion)

export { router as tasksRouter }