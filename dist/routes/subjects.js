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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.subjectRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const subjects = yield prisma.subject.findMany();
        res.json({ data: subjects });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/by-school', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: {
                school: true
            }
        });
        const subjects = yield prisma.subject.findMany({
            where: {
                schoolId: (_b = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0]) === null || _b === void 0 ? void 0 : _b.id
            },
            include: {
                teachers: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        res.json({ data: subjects });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { name, schoolId, } = req.body;
        const subject = yield prisma.subject.create({
            data: {
                name,
                schoolId,
            }
        });
        res.json(subject);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const subject = yield prisma.subject.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(subject);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const { name, schoolId, } = req.body;
        const subject = yield prisma.subject.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                schoolId,
            }
        });
        res.json(subject);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const subject = yield prisma.subject.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(subject);
    }
    catch (error) {
        next(error);
    }
}));
