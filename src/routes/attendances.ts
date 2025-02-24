import { Router, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const attendences = await prisma.attendence.findMany();
        res.json({ data: attendences });
    } catch (error) {
        next(error)
    }
});

router.get('/by-school', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.user?.id! },
            include: {
                school: true
            }
        })
        const attendences = await prisma.attendence.findMany(
            {
                where: {
                    schoolId: schoolAdmin?.school[0]?.id
                },
                include: {
                    student: {
                        select: {
                            name: true
                        }
                    },
                    class: {
                        select: {
                            name: true
                        }
                    },
                }
            }
        );
        res.json({ data: attendences });
    } catch (error) {
        next(error);
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

router.post('/bulk', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN]);

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.user?.id! },
            include: {
                school: true
            }
        });

        if (schoolAdmin!.school?.length < 0) {
            throw new Error('School not found');
        }

        const data: Prisma.AttendenceCreateManyInput[] = [];
        console.log(req.body);
        // res.json({ data: data });
        // return;

        req.body.forEach((attendence: Prisma.AttendenceCreateManyInput) => {
            data.push({
                status: attendence.status,
                inTime: attendence.inTime,
                classId: attendence.classId,
                studentId: attendence.studentId,
                schoolId: schoolAdmin!.school![0].id,
            });
        });

        const attendences = await prisma.attendence.createMany({
            data: data
        });
        res.json(attendences);
    } catch (error) {
        next(error)
    }
});

router.post('/from-device', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        res.json({ "message": "success" });
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