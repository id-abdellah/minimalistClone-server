import { Router } from "express";
import { deleteUser, getUserById, login, registerUser, setAvatar } from "../controllers/users.controller";
import { isUserExists, validateUserLoginData, validateUserRegisterationData } from "../middlewares/user.middlewares";
import { auth } from "../middlewares/auth.middleware";
import { deletePrevAvatar, uploadAvatar } from "../middlewares/multer.middleware";

const router = Router();

router.post("/register", validateUserRegisterationData, isUserExists, registerUser);

router.post("/login", validateUserLoginData, login);

router.get("/:user_id", getUserById);

router.post("/avatar", auth, deletePrevAvatar, uploadAvatar, setAvatar);

router.delete("/:user_id", deleteUser)

export { router as usersRouter }