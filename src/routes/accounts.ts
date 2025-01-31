import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const accounts = await prisma.accounts.findMany();
        res.json(accounts);

    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            name,
            schoolId,
        } = req.body;

        const accounts = await prisma.accounts.create({
            data: {
                name,
                schoolId,
            }
        });
        res.json(accounts);

    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const accounts = await prisma.accounts.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(accounts);

    } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const {
            name,
            schoolId,
        } = req.body;

        const accounts = await prisma.accounts.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                schoolId,
            }
        });
        res.json(accounts);

    } catch (error) {
        next(error)
    }
});

export { router as accountsRouter };