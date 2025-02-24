import { Request } from "express";


import { UnauthorizedError } from "./errors";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../routes/authentication";


export const CENTRAL_ADMIN = 'CENTRAL_ADMIN';
export const SCHOOL_ADMIN = 'SCHOOL_ADMIN';
export const TEACHER = 'TEACHER';
export const PARENT = 'PARENT';
export const STUDENT = 'STUDENT';


// export var isAuthenticated = (req: Request, whoCanAccess: string[] | undefined = undefined): boolean => {
//     if (req.session.user) {
//         if (whoCanAccess?.length) {
//             if (!whoCanAccess.includes(req.session.user.role!)) {
//                 throw new UnauthorizedError();
//             }
//         }
//         return true;
//     } else {
//         throw new UnauthorizedError();
//     }
// };

export var isAuthenticated = (req: Request, whoCanAccess: string[] | undefined = undefined): boolean => {
    
    // const authHeader = req.headers['authorization'];
    const token = req.cookies['auth.sms']// || authHeader && authHeader.split(' ')[1];

    console.log(token);
    if (!token) {
        throw new UnauthorizedError();
    }

    try {
        const user = jwt.verify(token, SECRET_KEY) as { id: number, authId: number, username: string, role: string };
        
        if (whoCanAccess?.length) {
            if (!whoCanAccess.includes(user.role)) {
                throw new UnauthorizedError();
            }
        }

        req.user = {
            id: user.id,
            authId: user.authId,
            username: user.username,
            role: user.role
        };
        return true;
    } catch (error) {
        throw new UnauthorizedError();
    }
};