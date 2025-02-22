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
exports.schoolRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.schoolRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const schools = yield prisma.school.findMany({
            include: {
                schoolAdmin: true
            }
        });
        res.json({ data: schools });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/analytics', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: {
                school: true
            }
        });
        const schoolId = (_b = schoolAdmin === null || schoolAdmin === void 0 ? void 0 : schoolAdmin.school[0]) === null || _b === void 0 ? void 0 : _b.id;
        if (!schoolId) {
            throw new Error('School not found');
        }
        res.json({
            data: {
                studentCount: yield prisma.student.count({ where: { schoolId } }),
                teacherCount: yield prisma.teacher.count({ where: { schoolId } }),
                parentCount: yield prisma.parent.count({ where: { schoolId } }),
                maleStudentCount: yield prisma.student.count({ where: { gender: 'male', schoolId } }),
                femaleStudentCount: yield prisma.student.count({ where: { gender: 'female', schoolId } }),
            }
        });
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
router.post('/with-admin', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.CENTRAL_ADMIN]);
        const { 
        // school
        school_name, school_address, school_phone, school_email, school_logo, school_description, 
        // admin
        admin_name, admin_address, admin_phone, admin_image, admin_email, admin_username, admin_password, } = req.body;
        const centralAdminId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        // if (!centralAdminId) {
        //     throw new Error('Central admin not found'); 
        // }
        const school = yield prisma.school.create({
            data: {
                name: school_name,
                address: school_address,
                phone: school_phone,
                email: school_email,
                logo: school_logo,
                description: school_description,
                centralAdminId,
            }
        });
        const hashPassword = yield bcryptjs_1.default.hash(admin_password, 10);
        const admin = yield prisma.schoolAdmin.create({
            data: {
                name: admin_name,
                address: admin_address,
                phone: admin_phone,
                email: admin_email,
                image: admin_image,
                school: {
                    connect: {
                        id: school.id
                    }
                },
                auth: {
                    create: {
                        username: admin_username || admin_email,
                        password: hashPassword,
                    }
                }
            }
        });
        res.json({ school, admin });
    }
    catch (error) {
        next(error);
    }
}));
