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
exports.studentRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.studentRouter = router;
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const studensts = yield prisma.student.findMany();
        res.json({ data: studensts });
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
        const students = yield prisma.student.findMany({
            where: {
                schoolId: schoolAdmin.school[0].id
            },
            include: {
                class: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ data: students });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/by-class/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const where = {};
        if (id) {
            where.classId = parseInt(id);
        }
        const schoolAdmin = yield prisma.schoolAdmin.findUnique({
            where: { id: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id },
            include: {
                school: true
            }
        });
        if (((_b = schoolAdmin.school) === null || _b === void 0 ? void 0 : _b.length) < 0) {
            throw new Error('School not found');
        }
        where.schoolId = schoolAdmin.school[0].id;
        const students = yield prisma.student.findMany({
            where,
        });
        res.json({ data: students });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req);
        const { id } = req.params;
        const student = yield prisma.student.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(student);
    }
    catch (error) {
        next(error);
    }
}));
// router.post('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [SCHOOL_ADMIN])
//         const {
//             username,
//             password,
//             email,
//             firstName,
//             lastName,
//             phone,
//             address,
//             bloodGroup,
//             birthDate,
//             gender,
//         } = req.body;
//         var data: Prisma.StudentCreateInput = {
//             email,
//             firstName,
//             lastName,
//             phone,
//             address,
//             bloodGroup,
//             birthDate,
//             gender,
//             auth: {}
//         }
//         var hashPassword = password ? bcrypt.hashSync(password, 10) : undefined;
//         if (hashPassword && username) {
//             data.auth = {
//                 create: { 
//                     username,
//                     password: hashPassword
//                 }
//             }
//         }
//         const student = await prisma.student.create({
//             data
//         });
//         res.json(student);
//     } catch (error) {
//         next(error)
//     }
// });
router.post('/with-school', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { username, password, email, name, phone, address, bloodGroup, birthDate, gender, image, classId, parentId, } = req.body;
        var data = {
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
            image,
            auth: {},
            school: {}
        };
        if (classId) {
            data.class = {
                connect: {
                    id: classId
                }
            };
        }
        if (parentId) {
            data.parent = {
                connect: {
                    id: parentId
                }
            };
        }
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
                    password: hashPassword
                }
            };
        }
        const student = yield prisma.student.create({
            data
        });
        res.json(student);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const { username, password, email, name, phone, address, bloodGroup, birthDate, gender, } = req.body;
        const student = yield prisma.student.update({
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
        res.json(student);
    }
    catch (error) {
        next(error);
    }
}));
