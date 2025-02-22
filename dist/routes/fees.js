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
exports.feeRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.feeRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const fees = yield prisma.fee.findMany();
        res.json({ data: fees });
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
                school: true,
            }
        });
        if (((_b = schoolAdmin.school) === null || _b === void 0 ? void 0 : _b.length) < 0) {
            throw new Error('School not found');
        }
        const fees = yield prisma.fee.findMany({
            where: {
                schoolId: schoolAdmin.school[0].id
            },
            include: {
                student: true,
                school: true,
            }
        });
        res.json({ data: fees });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const fee = yield prisma.fee.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(fee);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/with-calclution', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { totalAmount, discountAmount, paidAmount, details, status, date, studentId, } = req.body;
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: {
                school: true
            }
        });
        const defaultSchoolId = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0].id;
        const data = {
            totalAmount,
            discountAmount,
            paidAmount,
            details,
            status,
            date,
            school: {
                connect: {
                    id: defaultSchoolId
                }
            },
            student: {
                connect: {
                    id: parseInt(studentId)
                }
            }
        };
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const fee = yield tx.fee.create({
                data
            });
            const accounts = yield tx.accounts.findMany({
                where: {
                    schoolId: defaultSchoolId
                }
            });
            // Update the default account
            if (accounts.length > 0) {
                const account = accounts[0];
                yield tx.accounts.update({
                    where: {
                        id: account.id
                    },
                    data: {
                        income: (account.expense || 0) + (fee.paidAmount || 0),
                        balance: (account.balance || 0) + (fee.paidAmount || 0)
                    }
                });
                console.log("Account updated");
            }
            else {
                // Create a new default account
                yield tx.accounts.create({
                    data: {
                        name: "Default Account",
                        income: fee.paidAmount,
                        balance: fee.paidAmount,
                        defaultAccount: true,
                        school: {
                            connect: {
                                id: defaultSchoolId
                            }
                        }
                    }
                });
                console.log("Account created");
            }
        }));
        res.json({ message: 'Fee created successfully' });
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const { totalAmount, discountAmount, paidAmount, details, status, date, schoolId, studentId, } = req.body;
        const fee = yield prisma.fee.update({
            where: {
                id: parseInt(id)
            },
            data: {
                totalAmount,
                discountAmount,
                paidAmount,
                details,
                status,
                date,
                schoolId,
                studentId,
            }
        });
        res.json(fee);
    }
    catch (error) {
        next(error);
    }
}));
