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
exports.parentRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.parentRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const parents = yield prisma.parent.findMany();
        res.json({ data: parents });
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
        const parents = yield prisma.parent.findMany({
            where: {
                schoolId: schoolAdmin.school[0].id
            },
            include: {
            // students : true
            }
        });
        res.json({ data: parents });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const parent = yield prisma.parent.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(parent);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { username, password, email, name, phone, address, bloodGroup, birthDate, gender, } = req.body;
        var data = {
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
            auth: {},
            school: {}
        };
        var hashPassword = password ? bcryptjs_1.default.hashSync(password, 10) : undefined;
        if (hashPassword && username) {
            data.auth = {
                create: {
                    username,
                    password: hashPassword
                }
            };
        }
        const parent = yield prisma.parent.create({ data });
        res.json(parent);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/with-school', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        // spread body
        const { username, password, email, name, phone, address, bloodGroup, birthDate, gender, } = req.body;
        // construct create input
        var data = {
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
            auth: {},
            school: {}
        };
        // connect school
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: {
                school: true
            }
        });
        if (schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0]) {
            data.school = {
                connect: {
                    id: schoolAdmin.school[0].id
                }
            };
        }
        var hashPassword = password ? bcryptjs_1.default.hashSync(password, 10) : undefined;
        // add auth
        if (hashPassword && username) {
            data.auth = {
                create: {
                    username,
                    password: hashPassword
                }
            };
        }
        const parent = yield prisma.parent.create({ data });
        res.json(parent);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN, auth_1.PARENT]);
        const { id } = req.params;
        const { username, password, email, name, phone, address, bloodGroup, birthDate, gender, } = req.body;
        const parent = yield prisma.parent.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email,
                name,
                phone,
                address,
                bloodGroup,
                birthDate,
                gender,
                auth: {
                    update: {
                        username,
                        password: password ? bcryptjs_1.default.hashSync(password, 10) : undefined
                    }
                }
            }
        });
        res.json(parent);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const parent = yield prisma.parent.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(parent);
    }
    catch (error) {
        next(error);
    }
}));
