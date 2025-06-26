import { Response, Request, NextFunction } from "express";
import { string, z, ZodAny } from "zod";
import Jsend from "../utils/jsend";


/**
 * Validating Create Task Body
 */

const createTaskBodySchema = z.object({
    list_id: z.string().nonempty(),
    content: z.string().nonempty()
}).strict()

export type CreateTaskBodyType = z.infer<typeof createTaskBodySchema>;

export function validateCreateTaskBody(req: Request<{}, {}, CreateTaskBodyType>, res: Response, next: NextFunction) {
    const body = req.body;
    try {
        createTaskBodySchema.parse(body);
        next()
    } catch (error) {
        res.status(400).json(Jsend.fail("validation fail", error))
    }
}