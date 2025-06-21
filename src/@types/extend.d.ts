import "express";

export type MyJwtPayload = {
    email: string,
    user_id: string
}

declare module "express" {
    interface Request {
        user?: MyJwtPayload;
    }
}