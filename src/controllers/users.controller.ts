import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { DB } from "../config/db";
import { User, UserLogin } from "../middlewares/user.middlewares";
import { genID } from "../utils/utils";
import Jsend from "../utils/jsend";
import { genJWT } from "../utils/jwt";


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