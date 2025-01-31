"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.STUDENT = exports.PARENT = exports.TEACHER = exports.SCHOOL_ADMIN = exports.CENTRAL_ADMIN = void 0;
const errors_1 = require("./errors");
exports.CENTRAL_ADMIN = 'CENTRAL_ADMIN';
exports.SCHOOL_ADMIN = 'SCHOOL_ADMIN';
exports.TEACHER = 'TEACHER';
exports.PARENT = 'PARENT';
exports.STUDENT = 'STUDENT';
var isAuthenticated = (req, whoCanAccess = undefined) => {
    if (req.session.user) {
        if (whoCanAccess === null || whoCanAccess === void 0 ? void 0 : whoCanAccess.length) {
            if (!whoCanAccess.includes(req.session.user.role)) {
                throw new errors_1.UnauthorizedError();
            }
        }
        return true;
    }
    else {
        throw new errors_1.UnauthorizedError();
    }
};
exports.isAuthenticated = isAuthenticated;
