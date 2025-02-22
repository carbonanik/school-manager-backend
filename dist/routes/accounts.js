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
exports.accountsRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.accountsRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const accounts = yield prisma.accounts.findMany();
        res.json(accounts);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/analytics', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: { school: true }
        });
        const accounts = yield prisma.accounts.findMany({
            where: { schoolId: (_b = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0]) === null || _b === void 0 ? void 0 : _b.id }
        });
        const fees = yield prisma.fee.findMany({
            where: { schoolId: (_c = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0]) === null || _c === void 0 ? void 0 : _c.id }
        });
        const expences = yield prisma.expense.findMany({
            where: { schoolId: (_d = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0]) === null || _d === void 0 ? void 0 : _d.id }
        });
        const thisMonthIncome = fees.filter((fee) => {
            const date = fee.date;
            return (date === null || date === void 0 ? void 0 : date.getMonth()) === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
        }).reduce((total, fee) => {
            return total + (fee.paidAmount || 0);
        }, 0);
        const thisMonthExpense = expences.filter((expence) => {
            const date = expence.date;
            return (date === null || date === void 0 ? void 0 : date.getMonth()) === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
        }).reduce((total, expence) => { return total + (expence.amount || 0); }, 0);
        const todayIncome = fees.filter((fee) => {
            const date = fee.date;
            return (date === null || date === void 0 ? void 0 : date.getDate()) === new Date().getDate()
                && date.getMonth() === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
        }).reduce((total, fee) => {
            return total + (fee.paidAmount || 0);
        }, 0);
        const todayExpense = expences.filter((expence) => {
            const date = expence.date;
            return (date === null || date === void 0 ? void 0 : date.getDate()) === new Date().getDate()
                && date.getMonth() === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
        }).reduce((total, expence) => {
            return total + (expence.amount || 0);
        }, 0);
        res.json({
            data: {
                thisMonthIncome: thisMonthIncome,
                thisMonthExpense: thisMonthExpense,
                todayIncome: todayIncome,
                todayExpense: todayExpense,
                totalIncome: accounts[0].income,
                totalExpense: accounts[0].expense,
            }
        });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { name, schoolId, } = req.body;
        const accounts = yield prisma.accounts.create({
            data: {
                name,
                schoolId,
            }
        });
        res.json(accounts);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const accounts = yield prisma.accounts.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(accounts);
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
        const accounts = yield prisma.accounts.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                schoolId,
            }
        });
        res.json(accounts);
    }
    catch (error) {
        next(error);
    }
}));
