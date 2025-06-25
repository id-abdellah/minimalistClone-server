import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import Jsend from "../utils/jsend";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        res.status(err.status || 500).json(Jsend.error(err.message));
        return;
    }
    if ("sqlMessage" in err) {
        res.status(500).json(Jsend.error("MySQL Related Error *** " + err.code + " \n " + err.sqlMessage + " \n " + err?.sql))
        return;
    }
    res.status(500).json(Jsend.error("Internal Server Error \n" + String(err)))
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404).json(Jsend.fail(`The route you try to reach '${req.url}' is not found.`))
}