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
exports.teacherRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.teacherRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const teachers = yield prisma.teacher.findMany();
        res.json({ data: teachers });
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
        const teachers = yield prisma.teacher.findMany({
            where: {
                schoolId: schoolAdmin.school[0].id
            },
            include: {
                subjects: true,
                classes: true,
            }
        });
        res.json({ data: teachers });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/by-school/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const teachers = yield prisma.teacher.findMany({
            where: {
                schoolId: parseInt(id)
            }
        });
        res.json({ data: teachers });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { username, password, email, name, phone, address, bloodGroup, birthDate, gender, image, classesId, subjectsId, } = req.body;
        var data = {
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate: new Date(birthDate),
            gender,
            image,
            auth: {},
            school: {}
        };
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
        if (hashPassword && username) {
            data.auth = {
                create: {
                    username,
                    password: hashPassword,
                }
            };
        }
        if (classesId && classesId.length > 0) {
            data.classes = {
                connect: classesId.map((id) => {
                    return {
                        id
                    };
                })
            };
        }
        if (subjectsId && subjectsId.length > 0) {
            data.subjects = {
                connect: subjectsId.map((id) => {
                    return {
                        id
                    };
                })
            };
        }
        const teacher = yield prisma.teacher.create({
            data
        });
        res.json({
            massage: 'Teacher created successfully',
            data: teacher
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const teacher = yield prisma.teacher.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(teacher);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.TEACHER, auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const { username, password, email, name, phone, address, bloodGroup, birthDate, gender, } = req.body;
        const teacher = yield prisma.teacher.update({
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
                        password: password ? bcryptjs_1.default.hashSync(password, 10) : undefined,
                    }
                }
            }
        });
        res.json(teacher);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const teacher = yield prisma.teacher.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(teacher);
    }
    catch (error) {
        next(error);
    }
}));
