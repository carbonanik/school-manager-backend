import { Router, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const studensts = await prisma.student.findMany();
        res.json({ data: studensts });
    } catch (error) {
        next(error)
    }
});

router.get('/by-school', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.session.user?.id! },
            include: {
                school: true
            }
        });

        if (schoolAdmin!.school?.length < 0) {
            throw new Error('School not found');
        }
        const students = await prisma.student.findMany({
            where: {
                schoolId: schoolAdmin!.school[0].id
            },
            include: {
                class: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ data: students });
    } catch (error) {
        next(error)
    }
});

router.get('/by-class/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;

        const where: Prisma.StudentWhereInput = {}

        if (id) {
            where.classId = parseInt(id)
        }

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.session.user?.id! },
            include: {
                school: true
            }
        });

        if (schoolAdmin!.school?.length < 0) {
            throw new Error('School not found');
        }

        where.schoolId = schoolAdmin!.school[0].id

        const students = await prisma.student.findMany({
            where,
        });

        res.json({ data: students });
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const { id } = req.params;
        const student = await prisma.student.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(student);
    } catch (error) {
        next(error)
    }
});

// router.post('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {

//         isAuthenticated(req, [SCHOOL_ADMIN])
//         const {
//             username,
//             password,
//             email,
//             firstName,
//             lastName,
//             phone,
//             address,
//             bloodGroup,
//             birthDate,
//             gender,
//         } = req.body;

//         var data: Prisma.StudentCreateInput = {
//             email,
//             firstName,
//             lastName,
//             phone,
//             address,
//             bloodGroup,
//             birthDate,
//             gender,
//             auth: {}
//         }

//         var hashPassword = password ? bcrypt.hashSync(password, 10) : undefined;

//         if (hashPassword && username) {
//             data.auth = {
//                 create: { 
//                     username,
//                     password: hashPassword
//                 }
//             }
//         }

//         const student = await prisma.student.create({
//             data
//         });
//         res.json(student);
//     } catch (error) {
//         next(error)
//     }
// });

router.post('/with-school', async (req: Request, res: Response, next: NextFunction) => {
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
            image,
            classId,
            parentId,
        } = req.body;

        var data: Prisma.StudentCreateInput = {
            email,
            name,
            phone,
            address,
            bloodGroup,
            birthDate,
            gender,
            image,
            auth: {},
            school: {}
        }

        if (classId) {
            data.class = {
                connect: {
                    id: classId
                }
            }
        }

        if (parentId) {
            data.parent = {
                connect: {
                    id: parentId
                }
            }
        }

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.session.user?.id! },
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

        if (hashPassword && username) {
            data.auth = {
                create: {
                    username,
                    password: hashPassword
                }
            }
        }

        const student = await prisma.student.create({
            data
        });
        res.json(student);
    } catch (error) {
        next(error)
    }
});


router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
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

        const student = await prisma.student.update({
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
        res.json(student);
    } catch (error) {
        next(error)
    }
});

export { router as studentRouter };