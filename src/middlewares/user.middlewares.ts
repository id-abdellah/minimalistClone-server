import { NextFunction, Request, Response } from "express";
import z from "zod"
import Jsend from "../utils/jsend";
import { DB } from "../config/db";


const UserRegisterSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
}).strict();

const UserLoginSchema = UserRegisterSchema
    .omit({ username: true })
    .extend({ password: z.string() })
    .strict()

export type User = z.infer<typeof UserRegisterSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;

/**
 * User Registration 
 */

// validating body data when regestering new user
export function validateUserRegisterationData(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    try {
        UserRegisterSchema.parse(body);
        next();
    } catch (error) {
        res.status(400).send(Jsend.fail("validation failed", error))
    }
}

// checking if user already exists
export async function isUserExists(req: Request<{}, {}, User>, res: Response, next: NextFunction) {
    const { email } = req.body;
    const [rows] = await DB.query("SELECT * FROM users WHERE users.email = ?", [email]);
    if ((rows as any[]).length === 0) {
        next();
        return;
    }
    res.status(400).send(Jsend.error("there is already a user with given email"))
}



/**
 * User Login
 */

export function validateUserLoginData(req: Request<{}, {}, UserLogin>, res: Response, next: NextFunction) {
    const body = req.body;
    try {
        UserLoginSchema.parse(body);
        next()
    } catch (error) {
        res.status(400).send(Jsend.fail("login data validation failed", error))
    }
}