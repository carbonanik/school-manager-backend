import { Router, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const studenst = await prisma.student.findMany();
        res.json(studenst);
    } catch (error) {
        next(error)
    }
});

router.get('/by-school', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.session.user?.id! },
            include: {
                school: true
            }
        });

        if (schoolAdmin!.school?.length < 0) {
            throw new Error('School not found');
        }
        const students = await prisma.student.findMany({
            where: {
                schoolId: schoolAdmin!.school[0].id
            },
        });
        res.json({ data: students });
    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const { id } = req.params;
        const student = await prisma.student.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(student);
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

        var data: Prisma.StudentCreateInput = {
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
                    password: hashPassword
                }
            }
        }

        const student = await prisma.student.create({
            data
        });
        res.json(student);
    } catch (error) {
        next(error)
    }
});

router.post('/with-school', async (req: Request, res: Response, next: NextFunction) => {
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

        var data: Prisma.StudentCreateInput = {
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

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.session.user?.id! },
            include: {
                school: true
            }
        });

        if (schoolAdmin?.school[0]) {
            data.school = {
                connect: {
                    id: schoolAdmin.school[0].id
                }
            }
        }

        var hashPassword = password ? bcrypt.hashSync(password, 10) : undefined;

        if (hashPassword && username) {
            data.auth = {
                create: {
                    username,
                    password: hashPassword
                }
            }
        }

        const student = await prisma.student.create({
            data
        });
        res.json(student);
    } catch (error) {
        next(error)
    }
});


router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
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

        const student = await prisma.student.update({
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
                        password: password ? bcrypt.hashSync(password, 10) : undefined
                    }
                }
            }
        });
        res.json(student);
    } catch (error) {
        next(error)
    }
});

export { router as studentRouter };