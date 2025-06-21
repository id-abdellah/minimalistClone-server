import dotenv from "dotenv"
import jwt, { SignOptions } from "jsonwebtoken"
import { AppError } from "./appError";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export function genJWT(payload: object, options?: SignOptions) {
    if (!JWT_SECRET_KEY) throw new AppError("JWT_SECRET_KEY is not defined", 500);
    return jwt.sign(payload, JWT_SECRET_KEY, options);
}

export function verifyJWT(token: string) {
    if (!JWT_SECRET_KEY) throw new AppError("JWT_SECRET_KEY is not defined", 500);
    return jwt.verify(token, JWT_SECRET_KEY)
}