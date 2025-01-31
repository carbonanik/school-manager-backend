import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { CENTRAL_ADMIN, isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const schools = await prisma.school.findMany();
        res.json(schools);
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [CENTRAL_ADMIN])
        const {
            name,
            address,
            phone,
            email,
            logo,
            description,
            centralAdminId,
        } = req.body;

        const school = await prisma.school.create({
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

    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const { id } = req.params;
        const school = await prisma.school.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(school);
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
            address,
            phone,
            email,
            logo,
            description,
            centralAdminId,
        } = req.body;

        const school = await prisma.school.update({
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

    } catch (error) {
        next(error)
    }
});

export { router as schoolRouter };