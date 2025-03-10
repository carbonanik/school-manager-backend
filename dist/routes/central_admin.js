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
exports.centralAdminRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.centralAdminRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.CENTRAL_ADMIN]);
        const admins = (yield prisma.centralAdmin.findMany({
            include: {
                auth: {
                    select: { username: true }
                }
            }
        }));
        res.json(admins);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // isAuthenticated(req, [CENTRAL_ADMIN])
        const { name, username, email, password, } = req.body;
        var hashPassword = bcryptjs_1.default.hashSync(password, 10);
        const admin = yield prisma.centralAdmin.create({
            data: {
                auth: {
                    create: { username, password: hashPassword }
                },
                email,
                name,
            }
        });
        res.json({
            message: 'Admin created successfully',
            admin,
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.CENTRAL_ADMIN]);
        const { id } = req.params;
        const admin = yield prisma.centralAdmin.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(admin);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.CENTRAL_ADMIN]);
        const { id } = req.params;
        const { name, username, email, password, } = req.body;
        var hashPassword = password ? bcryptjs_1.default.hashSync(password, 10) : undefined;
        const admin = yield prisma.centralAdmin.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email,
                name,
                auth: {
                    update: {
                        username,
                        password: hashPassword,
                    }
                }
            }
        });
        res.json(admin);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.CENTRAL_ADMIN]);
        const { id } = req.params;
        const admin = yield prisma.centralAdmin.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(admin);
    }
    catch (error) {
        next(error);
    }
}));
