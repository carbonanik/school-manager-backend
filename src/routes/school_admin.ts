import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CENTRAL_ADMIN, isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [CENTRAL_ADMIN])
        const schoolAdmins = await prisma.schoolAdmin.findMany();
        res.json(schoolAdmins);
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [CENTRAL_ADMIN])
        const {
            name,
            username,
            email,
            schooId,
            password,
        } = req.body;

        var hashPassword = bcrypt.hashSync(password, 10);

        const admin = await prisma.schoolAdmin.create({
            data: {
                email,
                name,
                school: {
                    connect: {
                        id: parseInt(schooId)
                    }
                },
                auth: {
                    create: {
                        username: username || email,
                        password: hashPassword,
                    }
                }
            }
        });
        res.json(admin);
    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN, CENTRAL_ADMIN])
        const { id } = req.params;
        const admin = await prisma.schoolAdmin.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(admin);
    } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {

    try {
        isAuthenticated(req, [SCHOOL_ADMIN, CENTRAL_ADMIN])
        const { id } = req.params;
        const {
            name,
            username,
            email,
            schooId,
            password,
        } = req.body;

        var hashPassword = password ? bcrypt.hashSync(password, 10) : undefined;

        const admin = await prisma.schoolAdmin.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email,
                name,
                school: {
                    connect: {
                        id: parseInt(schooId)
                    }
                },
                auth: {
                    update: {
                        username,
                        password: hashPassword,
                    }
                }
            }
        });
        res.json(admin);
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [CENTRAL_ADMIN])
        const { id } = req.params;
        const admin = await prisma.schoolAdmin.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(admin);
    } catch (error) {
        next(error)
    }
});

export { router as schoolAdminRouter };