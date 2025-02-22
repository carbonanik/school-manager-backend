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
exports.feeTypeRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.feeTypeRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const feeTypes = yield prisma.feeType.findMany();
        res.json({ data: feeTypes });
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
        if (((_b = schoolAdmin.school) === null || _b === void 0 ? void 0 : _b.length) < 0) {
            throw new Error('School not found');
        }
        const feeTypes = yield prisma.feeType.findMany({
            where: {
                schoolId: schoolAdmin.school[0].id
            }
        });
        res.json({ data: feeTypes });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/with-school', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { title, amount, } = req.body;
        var data = {
            title,
            amount: parseFloat(amount),
        };
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: {
                school: true
            }
        });
        if (((_b = schoolAdmin.school) === null || _b === void 0 ? void 0 : _b.length) < 0) {
            throw new Error('School not found');
        }
        data.school = {
            connect: {
                id: schoolAdmin.school[0].id
            }
        };
        const feeType = yield prisma.feeType.create({
            data
        });
        res.json({ data: feeType });
    }
    catch (error) {
        next(error);
    }
}));
