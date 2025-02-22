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
        res.json({ data: expences });
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
        const expences = yield prisma.expense.findMany({
            where: {
                schoolId: (_b = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0]) === null || _b === void 0 ? void 0 : _b.id
            }
        });
        res.json({ data: expences });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { amount, details, status, date, schoolId, } = req.body;
        const expense = yield prisma.expense.create({
            data: {
                amount,
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
router.post('/with-calclution', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { amount, details, date, } = req.body;
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: {
                school: true
            }
        });
        const defaultSchoolId = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0].id;
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const expense = yield prisma.expense.create({
                data: {
                    amount,
                    details,
                    status: "Paid",
                    date,
                    school: {
                        connect: {
                            id: defaultSchoolId
                        }
                    }
                }
            });
            const accounts = yield tx.accounts.findMany({
                where: {
                    schoolId: defaultSchoolId
                }
            });
            // find the account where defaultAccount is true
            // const defaultAccount = accounts.find(account => account.defaultAccount);
            if (accounts.length > 0) {
                const account = accounts[0];
                yield tx.accounts.update({
                    where: {
                        id: account.id
                    },
                    data: {
                        expense: (account.expense || 0) + (expense.amount || 0),
                        balance: (account.balance || 0) - (expense.amount || 0)
                    }
                });
                console.log("Account updated");
            }
            else {
                // Create a new default account
                yield tx.accounts.create({
                    data: {
                        name: "Default Account",
                        expense: expense.amount,
                        balance: -(expense.amount || 0),
                        defaultAccount: true,
                        school: {
                            connect: {
                                id: defaultSchoolId
                            }
                        }
                    }
                });
                console.log("Default account created");
            }
        }));
        res.json({ message: 'Expense created successfully' });
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
        const { amount, details, status, date, schoolId, } = req.body;
        const expense = yield prisma.expense.update({
            where: {
                id: parseInt(id)
            },
            data: {
                amount,
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
