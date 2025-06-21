import multer from "multer";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import fs from "fs/promises"

const uploadsDirPath = path.join(__dirname, "../../uploads");

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, uploadsDirPath)
    },

    filename(req, file, callback) {
        const user_id = req.user?.user_id;
        const ext = path.extname(file.originalname);
        callback(null, `user_${user_id}${ext}`)
    },
})

const fileFilter: multer.Options["fileFilter"] = (req, file, callback) => {
    const fileType = file.mimetype.split("/")[0];
    if (fileType === "image") {
        callback(null, true);
    } else {
        callback(new AppError("only image file type is accepted", 400))
    }
}

export const uploadAvatar = multer({ storage, fileFilter }).single("avatar");


/**
 * Related middlewares
 **/

// when the same user upload avatar with diff "extension" name. avatars will be duplicated in "/uploads" folder
// so this middleware below, meant to delete previouse avatar.

export async function deletePrevAvatar(req: Request, res: Response, next: NextFunction) {
    const user_id = req.user?.user_id;

    const uploadsDirContent = await fs.readdir(uploadsDirPath);
    const userAvatarFile = uploadsDirContent.filter(filename => filename.startsWith(`user_${user_id}`))[0];
    if (userAvatarFile) {
        await fs.unlink(path.join(uploadsDirPath, userAvatarFile));
    };
    next()
}