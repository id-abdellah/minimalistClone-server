import { NextFunction, Response, Request } from "express";
import Jsend from "../utils/jsend";
import { verifyJWT } from "../utils/jwt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { MyJwtPayload } from "../@types/extend";


export async function auth(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers

    if (!authorization) {
        res.status(401).send(Jsend.error("token not provided"));
        return;
    }

    const token = authorization.split(" ")[1];

    try {
        const payload = verifyJWT(token) as MyJwtPayload;
        req.user = payload
        next();
    } catch (error) {
        const err = error as JsonWebTokenError;
        res.status(401).send(Jsend.error(`${err.name}: ${err.message}`))
    }
}