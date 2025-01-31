import { Request } from "express";
import { UnauthorizedError } from "./errors";


export const CENTRAL_ADMIN = 'CENTRAL_ADMIN';
export const SCHOOL_ADMIN = 'SCHOOL_ADMIN';
export const TEACHER = 'TEACHER';
export const PARENT = 'PARENT';
export const STUDENT = 'STUDENT';


export var isAuthenticated = (req: Request, whoCanAccess: string[] | undefined = undefined): boolean => {
    if (req.session.user) {
        if (whoCanAccess?.length) {
            if (!whoCanAccess.includes(req.session.user.role!)) {
                throw new UnauthorizedError();
            }
        }
        return true;
    } else {
        throw new UnauthorizedError();
    }
};