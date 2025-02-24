import { Router, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const classes = await prisma.class.findMany();
        res.json(classes);

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
        });

        if (schoolAdmin!.school?.length < 0) {
            throw new Error('School not found');
        }

        const classes = await prisma.class.findMany({
            where: {
                schoolId: schoolAdmin?.school[0]?.id
            },
            include: {
                supervisor: true
            }
        });
        res.json({ data: classes });
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            name,
            capacity,
            supervisorId,
            schoolId,
        } = req.body;

        const _class = await prisma.class.create({
            data: {
                name,
                capacity,
                supervisorId,
                schoolId,
            }
        });
        res.json(_class);
    } catch (error) {
        next(error)
    }
});

router.post('/with-school', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            name,
            capacity,
            supervisorId,
        } = req.body;


        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.user?.id! },
            include: {
                school: true
            }
        });

        if (schoolAdmin!.school?.length < 0) {
            throw new Error('School not found');
        }

        const schoolId = schoolAdmin?.school[0]?.id

        const data: Prisma.ClassCreateInput = {
            name,
            capacity,
            supervisor: {
                connect: {
                    id: supervisorId
                }
            },
            school: {
                connect: {
                    id: schoolId
                }
            }
        }

        const _class = await prisma.class.create({
            data
        });
        res.json({ data: _class });
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const { id } = req.params;
        const _class = await prisma.class.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(_class);
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
            capacity,
            supervisorId,
            schoolId,
        } = req.body;

        const _class = await prisma.class.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                capacity,
                supervisorId,
                schoolId,
            }
        });
        res.json(_class);

    } catch (error) {
        next(error)
    }
});


router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const _class = await prisma.class.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(_class);
    } catch (error) {
        next(error)
    }
});

export { router as classRouter };