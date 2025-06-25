import { NextFunction, Request, Response } from "express";
import { TypeOf, z } from "zod";
import Jsend from "../utils/jsend";

/**
 * list creation
 */

const listCreationBodySchema = z.object({
    list_name: z.string()
}).strict();

export type ListCreationBodyType = z.infer<typeof listCreationBodySchema>;

export function validateListCreationBody(req: Request<{}, {}, ListCreationBodyType>, res: Response, next: NextFunction) {
    const body = req.body;
    try {
        listCreationBodySchema.parse(body);
        next()
    } catch (error) {
        res.status(400).json(Jsend.fail("validation failed", error))
    }
}


/**
 * list update name
 */

const listNameUpdateBodySchema = z.object({
    newName: z.string()
}).strict();

export type ListNameUpdateBodyType = z.infer<typeof listNameUpdateBodySchema>

export function validateListNameUpdateBody(req: Request<{}, {}, ListNameUpdateBodyType>, res: Response, next: NextFunction) {
    const body = req.body;
    try {
        listNameUpdateBodySchema.parse(body);
        next()
    } catch (error) {
        res.status(400).json(Jsend.fail("validation failed", error))
    }
}