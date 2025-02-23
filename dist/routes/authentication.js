"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRouter = exports.SECRET_KEY = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../util/auth");
const errors_1 = require("../util/errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.authenticationRouter = router;
exports.SECRET_KEY = 'your-secret-key';
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, remember, } = req.body;
        var auth = yield prisma.authInfo.findUnique({
            where: { username },
            include: {
                CentralAdmin: true,
                SchoolAdmin: true,
                Teacher: true,
                Parent: true,
                Student: true
            },
        });
        if (!auth) {
            throw new errors_1.InvalidCredentialsError();
        }
        if (!bcryptjs_1.default.compareSync(password, auth.password)) {
            throw new errors_1.InvalidCredentialsError();
        }
        // if (remember) {
        //     req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds
        // }
        var userId;
        var userRole;
        if (auth.CentralAdmin) {
            userId = auth.CentralAdmin.id;
            userRole = auth_1.CENTRAL_ADMIN;
        }
        else if (auth.SchoolAdmin) {
            userId = auth.SchoolAdmin.id;
            userRole = auth_1.SCHOOL_ADMIN;
        }
        else if (auth.Teacher) {
            userId = auth.Teacher.id;
            userRole = auth_1.TEACHER;
        }
        else if (auth.Parent) {
            userId = auth.Parent.id;
            userRole = auth_1.PARENT;
        }
        else if (auth.Student) {
            userId = auth.Student.id;
            userRole = auth_1.STUDENT;
        }
        if (!userId || !userRole) {
            throw new errors_1.InvalidCredentialsError();
        }
        const user = {
            id: userId,
            username: auth.username,
            role: userRole
        };
        const token = jsonwebtoken_1.default.sign(user, exports.SECRET_KEY, { expiresIn: '1h' });
        // req.session.user = {
        //     id: userId,
        //     username: auth!.username,
        //     role: userRole,
        // };
        // req.session.save();
        res.json({ message: 'Login successful', user, token });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/name', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        res.json({ message: 'Welcome', user: req === null || req === void 0 ? void 0 : req.user });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/get-user', (req, res, next) => {
    try {
        (0, auth_1.isAuthenticated)(req);
        res.json({ message: 'Welcome', user: req.user });
    }
    catch (error) {
        next(error);
    }
});
