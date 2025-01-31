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
exports.expenseRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.expenseRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const expences = yield prisma.expense.findMany();
        res.json(expences);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { amount, totalAmount, paidAmount, details, status, date, schoolId, } = req.body;
        const expense = yield prisma.expense.create({
            data: {
                amount,
                totalAmount,
                paidAmount,
                details,
                status,
                date,
                schoolId,
            }
        });
        res.json(expense);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const expense = yield prisma.expense.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(expense);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const { amount, totalAmount, paidAmount, details, status, date, schoolId, studentId, } = req.body;
        const expense = yield prisma.expense.update({
            where: {
                id: parseInt(id)
            },
            data: {
                amount,
                totalAmount,
                paidAmount,
                details,
                status,
                date,
                schoolId,
            }
        });
        res.json(expense);
    }
    catch (error) {
        next(error);
    }
}));
