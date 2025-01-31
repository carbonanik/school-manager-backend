import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
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
                username,
                password: hashPassword
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