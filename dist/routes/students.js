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
        const studenst = yield prisma.student.findMany();
        res.json(studenst);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { username, password, email, firstName, lastName, phone, address, bloodGroup, birthDate, gender, } = req.body;
        var data = {
            email,
            firstName,
            lastName,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
            auth: {}
        };
        var hashPassword = password ? bcryptjs_1.default.hashSync(password, 10) : undefined;
        if (hashPassword && username) {
            data.auth = {
                username,
                password: hashPassword
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
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
        const { id } = req.params;
        const { username, password, email, firstName, lastName, phone, address, bloodGroup, birthDate, gender, } = req.body;
        const student = yield prisma.student.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email,
                firstName,
                lastName,
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
