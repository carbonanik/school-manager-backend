import { Router, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { isAuthenticated, PARENT, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const parents = await prisma.parent.findMany();
        res.json({ data: parents });
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
        const parents = await prisma.parent.findMany({
            where: {
                schoolId: schoolAdmin!.school[0].id
            },
            include: {
                // students : true
            }
        });
        res.json({ data: parents });
    } catch (error) {
        next(error)
    }
});


router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const { id } = req.params;
        const parent = await prisma.parent.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(parent);
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
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
        } = req.body;


        var data: Prisma.ParentCreateInput = {
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
            auth: {},
            school: {}
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

        const parent = await prisma.parent.create({ data });
        res.json(parent);

    } catch (error) {
        next(error)
    }
});

router.post('/with-school', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])

        // spread body
        const {
            username,
            password,
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
        } = req.body;

        // construct create input
        var data: Prisma.ParentCreateInput = {
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
            auth: {},
            school: {}
        }

        // connect school
        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.user?.id! },
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

        // add auth
        if (hashPassword && username) {
            data.auth = {
                create: {
                    username,
                    password: hashPassword
                }
            }
        }

        const parent = await prisma.parent.create({ data });
        res.json(parent);

    } catch (error) {
        next(error)
    }
});


router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN, PARENT])
        const { id } = req.params;
        const {
            username,
            password,
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
        } = req.body;

        const parent = await prisma.parent.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email,
                name,
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
        res.json(parent);
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const parent = await prisma.parent.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(parent);
    } catch (error) {
        next(error)
    }
});

export { router as parentRouter };