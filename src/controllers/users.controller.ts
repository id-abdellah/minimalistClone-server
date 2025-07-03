import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { DB } from "../config/db";
import { User, UserLogin } from "../middlewares/user.middlewares";
import { genID } from "../utils/utils";
import Jsend from "../utils/jsend";
import { genJWT } from "../utils/jwt";
import { ColumnsSchema, filterColumns } from "../utils/dbUtils";
import { AppError } from "../utils/appError";
import { UsersModel } from "../models/users.model";
import path from "path";
import { unlink } from "fs/promises";


export async function registerUser(req: Request<{}, {}, User>, res: Response) {
    const { email, password, username } = req.body;
    const user_id = genID("u_");
    const hashedPassword = await bcrypt.hash(password, 10);
    await DB.query(
        "INSERT INTO users (user_id, username, email, password_hash) VALUES (?, ?, ?, ?)",
        [user_id, username, email, hashedPassword]
    );
    // generating jwt
    const token = genJWT({ user_id, email })
    res.status(201).send(Jsend.success({ token }))
}

export async function login(req: Request<{}, {}, UserLogin>, res: Response) {
    const { email, password } = req.body;

    // check user existens
    const [rows] = await DB.query("SELECT * FROM users WHERE users.email = ?", [email]);
    const user = (rows as UsersModel[])[0];
    if (!user) {
        res.status(400).send(Jsend.fail("no user with given email"));
        return;
    }

    // check password matching
    const { password_hash } = user;
    const isPasswordMatch = await bcrypt.compare(password, password_hash);
    if (!isPasswordMatch) {
        res.status(400).send(Jsend.fail("invalid password"));
        return;
    }

    const token = genJWT({ email: user.email, user_id: user.user_id });
    res.status(200).send(Jsend.success({ token }));
}

export async function getUserById(req: Request<{ user_id: string }>, res: Response) {
    const BASE_URL = process.env.BASE_URL;
    if (!BASE_URL) throw new AppError("BASE_URL env variable does not provided", 500);

    const user_id = req.params.user_id;

    // filtering cols
    const [columnsSchema] = await DB.query("SHOW COLUMNS FROM users");
    const columns = columnsSchema as ColumnsSchema[];
    const filteredCols = filterColumns(columns, ["password_hash"]);

    const [rows] = await DB.query(`SELECT ${filteredCols} FROM users WHERE users.user_id = ?`, [user_id]);
    let user = (rows as UsersModel[])[0];

    if (!user) {
        res.status(404).send(Jsend.fail("user dosn't exist"))
        return;
    }

    user.avatar = !user.avatar ? "default.jpg" : user.avatar;
    const avatarUrl = `${BASE_URL}/api/useravatar/${user.avatar}`;

    const responseData = { ...user, avatarUrl }

    res.status(200).send(Jsend.success(responseData))
}

export async function setAvatar(req: Request, res: Response) {
    if (!req.file) {
        res.status(400).send(Jsend.fail("no avatar file uploaded"))
        return;
    }

    const user_id = req.user?.user_id;

    const { filename } = req.file

    await DB.query(
        "UPDATE users SET avatar = ? WHERE user_id = ?",
        [filename, user_id]
    )

    res.status(201).send(Jsend.success({ message: "avatar successfuly updated" }))
}

export async function deleteUser(req: Request<{ user_id: string }>, res: Response) {
    const admin = req.body?.admin;
    const user_id = req.params.user_id;
    if (!admin || admin !== 2288) {
        res.status(401).json(Jsend.error("You are not an admin"));
        return;
    }

    const [userRow] = await DB.query("SELECT * FROM users WHERE users.user_id = ?", [user_id]);
    const user = (userRow as UsersModel[])[0];

    if (!user) {
        res.status(404).json(Jsend.fail("user dosn't exist"))
        return;
    }

    if (user.avatar !== null && user.avatar !== "default.jpg") {
        const uploadsDirPath = path.join(__dirname, "../../uploads");
        const avatarPath = path.join(uploadsDirPath, `/${user.avatar}`);
        await unlink(avatarPath);
    }

    await DB.query("DELETE FROM users WHERE users.user_id = ?", [user_id]);
    res.json(Jsend.success("deleted successfuly"));
}