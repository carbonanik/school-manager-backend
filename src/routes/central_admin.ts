import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CENTRAL_ADMIN, isAuthenticated } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [CENTRAL_ADMIN])
        const admins = (await prisma.centralAdmin.findMany({
            include: {
                auth: {
                    select: { username: true }
                }
            }
        }));
        res.json(admins);
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // isAuthenticated(req, [CENTRAL_ADMIN])
        const {
            name,
            username,
            email,
            password,
        } = req.body;

        var hashPassword = bcrypt.hashSync(password, 10);

        const admin = await prisma.centralAdmin.create({
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
    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [CENTRAL_ADMIN])
        const { id } = req.params;
        const admin = await prisma.centralAdmin.findUnique({
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
        isAuthenticated(req, [CENTRAL_ADMIN])
        const { id } = req.params;
        const {
            name,
            username,
            email,
            password,
        } = req.body;

        var hashPassword = password ? bcrypt.hashSync(password, 10) : undefined;

        const admin = await prisma.centralAdmin.update({
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
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [CENTRAL_ADMIN])
        const { id } = req.params;
        const admin = await prisma.centralAdmin.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(admin);
    } catch (error) {
        next(error)
    }
});

export { router as centralAdminRouter };