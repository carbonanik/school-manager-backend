"use strict";
// import { Router, Request, Response, NextFunction } from "express";
// import { PrismaClient } from '@prisma/client';
// import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";
// const prisma = new PrismaClient()
// const router = Router();
// router.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req)
//         const subjects = await prisma.subject.findMany();
//         res.json({ data: subjects });
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
//         const subjects = await prisma.subject.findMany({
//             where: {
//                 schoolId: schoolAdmin?.school[0]?.id
//             },
//             include: {
//                 teachers: {
//                     select: {
//                         id: true,
//                         name: true
//                     }
//                 }
//             }
//         });
//         res.json({ data: subjects });
//     } catch (error) {
//         next(error)
//     }
// })
// router.post('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [SCHOOL_ADMIN])
//         const {
//             name,
//             schoolId,
//         } = req.body;
//         const subject = await prisma.subject.create({
//             data: {
//                 name,
//                 schoolId,
//             }
//         });
//         res.json(subject);
//     } catch (error) {
//         next(error)
//     }
// });
// router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req)
//         const { id } = req.params;
//         const subject = await prisma.subject.findUnique({
//             where: {
//                 id: parseInt(id)
//             }
//         });
//         res.json(subject);
//     } catch (error) {
//         next(error)
//     }
// });
// router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [SCHOOL_ADMIN])
//         const { id } = req.params;
//         const {
//             name,
//             schoolId,
//         } = req.body;
//         const subject = await prisma.subject.update({
//             where: {
//                 id: parseInt(id)
//             },
//             data: {
//                 name,
//                 schoolId,
//             }
//         });
//         res.json(subject);
//     } catch (error) {
//         next(error)
//     }
// });
// router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [SCHOOL_ADMIN])
//         const { id } = req.params;
//         const subject = await prisma.subject.delete({
//             where: {
//                 id: parseInt(id)
//             }
//         });
//         res.json(subject);
//     } catch (error) {
//         next(error)
//     }
// });
// export { router as subjectRouter };
