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
exports.schoolRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.schoolRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const schools = yield prisma.school.findMany();
        res.json(schools);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.CENTRAL_ADMIN]);
        const { name, address, phone, email, logo, description, centralAdminId, } = req.body;
        const school = yield prisma.school.create({
            data: {
                name,
                address,
                phone,
                email,
                logo,
                description,
                centralAdminId,
            }
        });
        res.json(school);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const school = yield prisma.school.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(school);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN, auth_1.CENTRAL_ADMIN]);
        const { id } = req.params;
        const { name, address, phone, email, logo, description, centralAdminId, } = req.body;
        const school = yield prisma.school.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                address,
                phone,
                email,
                logo,
                description,
                centralAdminId,
            }
        });
        res.json(school);
    }
    catch (error) {
        next(error);
    }
}));
