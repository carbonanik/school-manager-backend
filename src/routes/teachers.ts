// import { Router, Request, Response, NextFunction } from "express";
// import { Prisma, PrismaClient, Teacher } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import { isAuthenticated, SCHOOL_ADMIN, TEACHER } from "../util/auth";

// const prisma = new PrismaClient()
// const router = Router();

// router.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req)
//         const teachers = await prisma.teacher.findMany();
//         res.json({ data: teachers });
//     } catch (error) {
//         next(error)
//     }
// });

// router.get('/by-school', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [SCHOOL_ADMIN])
//         const schoolAdmin = await prisma.schoolAdmin.findUnique({
//             where: { id: req.session.user?.id! },
//             include: {
//                 school: true
//             }
//         });


//         if (schoolAdmin!.school?.length < 0) {
//             throw new Error('School not found');
//         }
//         const teachers = await prisma.teacher.findMany({
//             where: {
//                 schoolId: schoolAdmin!.school[0].id
//             },
//             include: {
//                 subjects: true,
//                 classes: true,
//             }
//         });
//         res.json({ data: teachers });
//     } catch (error) {
//         next(error)
//     }
// });

// router.get('/by-school/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req)
//         const { id } = req.params;
//         const teachers = await prisma.teacher.findMany({
//             where: {
//                 schoolId: parseInt(id)
//             }
//         });
//         res.json({ data: teachers });
//     } catch (error) {
//         next(error)
//     }
// });

// router.post('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [SCHOOL_ADMIN])
//         const {
//             username,
//             password,
//             email,
//             name,
//             phone,
//             address,
//             bloodGroup,
//             birthDate,
//             gender,
//             image,
//             classesId,
//             subjectsId,
//         } = req.body;

//         var data: Prisma.TeacherCreateInput = {
//             email,
//             name,
//             phone,
//             address,
//             bloodGroup,
//             birthDate: new Date(birthDate),
//             gender,
//             image,
//             auth: {},
//             school: {}
//         }

//         const schoolAdmin = await prisma.schoolAdmin.findUnique({
//             where: { id: req.session.user?.id! },
//             include: {
//                 school: true
//             }
//         });

//         if (schoolAdmin?.school[0]) {
//             data.school = {
//                 connect: {
//                     id: schoolAdmin.school[0].id
//                 }
//             }
//         }

//         var hashPassword = password ? bcrypt.hashSync(password, 10) : undefined;

//         if (hashPassword && username) {
//             data.auth = {
//                 create: {
//                     username,
//                     password: hashPassword,
//                 }
//             }
//         }

//         if (classesId && classesId.length > 0) {
//             data.classes = {
//                 connect: classesId.map((id: number) => {
//                     return {
//                         id
//                     }
//                 })
//             }
//         }

//         if (subjectsId && subjectsId.length > 0) {
//             data.subjects = {
//                 connect: subjectsId.map((id: number) => {
//                     return {
//                         id
//                     }
//                 })
//             }
//         }

//         const teacher = await prisma.teacher.create({
//             data
//         });
//         res.json({
//             massage: 'Teacher created successfully',
//             data: teacher
//         });
//     } catch (error) {
//         next(error)
//     }
// });

// router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req)
//         const { id } = req.params;
//         const teacher = await prisma.teacher.findUnique({
//             where: {
//                 id: parseInt(id)
//             }
//         });
//         res.json(teacher);
//     } catch (error) {
//         next(error)
//     }
// });

// router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [TEACHER, SCHOOL_ADMIN])
//         const { id } = req.params;
//         const {
//             username,
//             password,
//             email,
//             name,
//             phone,
//             address,
//             bloodGroup,
//             birthDate,
//             gender,
//         } = req.body;

//         const teacher = await prisma.teacher.update({
//             where: {
//                 id: parseInt(id)
//             },
//             data: {
//                 email,
//                 name,
//                 phone,
//                 address,
//                 bloodGroup,
//                 birthDate,
//                 gender,
//                 auth: {
//                     update: {
//                         username,
//                         password: password ? bcrypt.hashSync(password, 10) : undefined,
//                     }
//                 }
//             }
//         });
//         res.json(teacher);
//     } catch (error) {
//         next(error)
//     }
// });

// router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [SCHOOL_ADMIN])
//         const { id } = req.params;
//         const teacher = await prisma.teacher.delete({
//             where: {
//                 id: parseInt(id)
//             }
//         });
//         res.json(teacher);
//     } catch (error) {
//         next(error)
//     }
// });

// export { router as teacherRouter };