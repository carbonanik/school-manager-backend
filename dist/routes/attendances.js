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
exports.attendenceRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.attendenceRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const attendences = yield prisma.attendence.findMany();
        res.json({ data: attendences });
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
        const attendences = yield prisma.attendence.findMany({
            where: {
                schoolId: (_b = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0]) === null || _b === void 0 ? void 0 : _b.id
            },
            include: {
                student: {
                    select: {
                        name: true
                    }
                },
                class: {
                    select: {
                        name: true
                    }
                },
            }
        });
        res.json({ data: attendences });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { inTime, status, classId, studentId, schoolId, } = req.body;
        const attendence = yield prisma.attendence.create({
            data: {
                inTime,
                status,
                classId,
                studentId,
                schoolId,
            }
        });
        res.json(attendence);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/bulk', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: {
                school: true
            }
        });
        if (((_b = schoolAdmin.school) === null || _b === void 0 ? void 0 : _b.length) < 0) {
            throw new Error('School not found');
        }
        const data = [];
        console.log(req.body);
        // res.json({ data: data });
        // return;
        req.body.forEach((attendence) => {
            data.push({
                status: attendence.status,
                inTime: attendence.inTime,
                classId: attendence.classId,
                studentId: attendence.studentId,
                schoolId: schoolAdmin.school[0].id,
            });
        });
        const attendences = yield prisma.attendence.createMany({
            data: data
        });
        res.json(attendences);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/from-device', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        res.json({ "message": "success" });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const attendence = yield prisma.attendence.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(attendence);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const { inTime, status, classId, studentId, schoolId, } = req.body;
        const attendence = yield prisma.attendence.update({
            where: {
                id: parseInt(id)
            },
            data: {
                inTime,
                status,
                classId,
                studentId,
                schoolId,
            }
        });
        res.json(attendence);
    }
    catch (error) {
        next(error);
    }
}));
