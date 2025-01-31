import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { isAuthenticated, SCHOOL_ADMIN, TEACHER } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const teachers = await prisma.teacher.findMany();
        res.json(teachers);
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            username,
            password,
            email,
            firstName,
            lastName,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
        } = req.body;

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
        }

        var hashPassword = password ? bcrypt.hashSync(password, 10) : undefined;

        if (hashPassword && username) {
            data.auth = {
                create: {
                    username,
                    password: hashPassword,
                }
            }
        }

        const teacher = await prisma.teacher.create({ data });
        res.json(teacher);
    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const { id } = req.params;
        const teacher = await prisma.teacher.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(teacher);
    } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [TEACHER, SCHOOL_ADMIN])
        const { id } = req.params;
        const {
            username,
            password,
            email,
            firstName,
            lastName,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
        } = req.body;

        const teacher = await prisma.teacher.update({
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
                        password: password ? bcrypt.hashSync(password, 10) : undefined,
                    }
                }
            }
        });
        res.json(teacher);
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const teacher = await prisma.teacher.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(teacher);
    } catch (error) {
        next(error)
    }
});

export { router as teacherRouter };