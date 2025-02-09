import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { CENTRAL_ADMIN, isAuthenticated, SCHOOL_ADMIN } from "../util/auth";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const schools = await prisma.school.findMany({
            include: {
                schoolAdmin: true
            }
        });
        res.json({ data: schools });
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

router.post('/with-admin', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [CENTRAL_ADMIN])
        const {
            // school
            school_name,
            school_address,
            school_phone,
            school_email,
            school_logo,
            school_description,
            // admin
            admin_name,
            admin_address,
            admin_phone,
            admin_image,
            admin_email,
            admin_username,
            admin_password,
        } = req.body;

        const centralAdminId = req.session.user?.id

        // if (!centralAdminId) {
        //     throw new Error('Central admin not found'); 
        // }

        const school = await prisma.school.create({
            data: {
                name: school_name,
                address: school_address,
                phone: school_phone,
                email: school_email,
                logo: school_logo,
                description: school_description,
                centralAdminId,
            }
        });

        const hashPassword = await bcrypt.hash(admin_password, 10);

        const admin = await prisma.schoolAdmin.create({
            data: {
                name: admin_name,
                address: admin_address,
                phone: admin_phone,
                email: admin_email,
                image: admin_image,
                school: {
                    connect: {
                        id: school.id
                    }
                },
                auth: {
                    create: {
                        username: admin_username || admin_email,
                        password: hashPassword,
                    }
                }
            }
        });

        res.json({ school, admin });
    } catch (error) {
        next(error)
    }
});

export { router as schoolRouter };