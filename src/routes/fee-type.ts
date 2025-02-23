// import { Router, Request, Response, NextFunction } from "express";
// import { Prisma, PrismaClient } from '@prisma/client';
// import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

// const prisma = new PrismaClient()
// const router = Router();

// router.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req)
//         const feeTypes = await prisma.feeType.findMany();
//         res.json({ data: feeTypes });
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

//         const feeTypes = await prisma.feeType.findMany({
//             where: {
//                 schoolId: schoolAdmin!.school[0].id
//             }
//         });

//         res.json({ data: feeTypes });

//     } catch (error) {
//         next(error)
//     }
// });

// router.post('/with-school', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         isAuthenticated(req, [SCHOOL_ADMIN]);

//         const {
//             title,
//             amount,
//         } = req.body

//         var data: Prisma.FeeTypeCreateInput = {
//             title,
//             amount: parseFloat(amount),
//         }

//         const schoolAdmin = await prisma.schoolAdmin.findUnique({
//             where: { id: req.session.user?.id! },
//             include: {
//                 school: true
//             }
//         });

//         if (schoolAdmin!.school?.length < 0) {
//             throw new Error('School not found');
//         }

//         data.school = {
//             connect: {
//                 id: schoolAdmin!.school[0].id
//             }
//         }

//         const feeType = await prisma.feeType.create({
//             data
//         });

//         res.json({ data: feeType });

//     } catch (error) {
//         next(error)
//     }
// });


// export { router as feeTypeRouter };