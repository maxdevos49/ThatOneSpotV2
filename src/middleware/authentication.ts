import { Response, NextFunction } from "express";

export function authentication(req: any, res: Response, next: NextFunction) {


    if (!req.userContext) {
        res.locals = {
            authentication: {
                role: ["public"]
            }
        };
        return next();
    }

    let user = req.userContext.userinfo;

    res.locals = {
        authentication: {
            id: user.sub,
            given_name: user.given_name,
            family_name: user.family_name,
            role: user.groups.map((role: string) => role.toLowerCase()),
            username: user.preferred_username
        }
    };

    next();
}
