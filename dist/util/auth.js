"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.STUDENT = exports.PARENT = exports.TEACHER = exports.SCHOOL_ADMIN = exports.CENTRAL_ADMIN = void 0;
const errors_1 = require("./errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication_1 = require("../routes/authentication");
exports.CENTRAL_ADMIN = 'CENTRAL_ADMIN';
exports.SCHOOL_ADMIN = 'SCHOOL_ADMIN';
exports.TEACHER = 'TEACHER';
exports.PARENT = 'PARENT';
exports.STUDENT = 'STUDENT';
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
var isAuthenticated = (req, whoCanAccess = undefined) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        throw new errors_1.UnauthorizedError();
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, authentication_1.SECRET_KEY);
        console.log(user);
        req.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        return true;
    }
    catch (error) {
        throw new errors_1.UnauthorizedError();
    }
};
exports.isAuthenticated = isAuthenticated;
