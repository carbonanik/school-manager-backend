import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const lessons = await prisma.lesson.findMany();
        res.json(lessons);

    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            name,
            classId,
            schoolId,
            subjectId,
            teacherId,
        } = req.body;

        const lesson = await prisma.lesson.create({
            data: {
                name,
                classId,
                schoolId,
                subjectId,
                teacherId,
            }
        });
        res.json(lesson);

    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const { id } = req.params;
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(lesson);

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
            classId,
            schoolId,
            subjectId,
            teacherId,
        } = req.body;

        const lesson = await prisma.lesson.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                classId,
                schoolId,
                subjectId,
                teacherId,
            }
        });
        res.json(lesson);

    } catch (error) {
        next(error)
    }
});

export { router as lessonRouter };