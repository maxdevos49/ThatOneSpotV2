import { Response, Request, NextFunction } from "express";
/**
 * middleware for doing role-based permissions
 * @param allowed allowed roles
 * @param redirect redirect route if role is not permitted. default is the home index of the site
 */
export function permit(allowed: string[], redirect: string = "/") {

    return (req: Request, res: Response, next: NextFunction) => {

        let result: string[] = res.locals.authentication.role.filter((role: string) => allowed.includes(role));

        if (result.length > 0)
            return next();
        else
            return res.redirect(redirect);

    };
}

