import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const attendences = await prisma.attendence.findMany();
        res.json(attendences);
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            inTime,
            status,
            classId,
            studentId,
            schoolId,
        } = req.body;

        const attendence = await prisma.attendence.create({
            data: {
                inTime,
                status,
                classId,
                studentId,
                schoolId,
            }
        });
        res.json(attendence);

    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const { id } = req.params;
        const attendence = await prisma.attendence.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(attendence);

    } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const {
            inTime,
            status,
            classId,
            studentId,
            schoolId,
        } = req.body;

        const attendence = await prisma.attendence.update({
            where: {
                id: parseInt(id)
            },
            data: {
                inTime,
                status,
                classId,
                studentId,
                schoolId,
            }
        });
        res.json(attendence);

    } catch (error) {
        next(error)
    }

});

export { router as attendenceRouter };