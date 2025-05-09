import { Router, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)

        const fees = await prisma.fee.findMany();
        res.json({ data: fees });

    } catch (error) {
        next(error)
    }
});

router.get('/summery', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN]);
        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.user?.id! },
            include: {
                school: true,
            }
        });

        if (schoolAdmin!.school?.length < 0) {
            throw new Error('School not found');
        }

        const schoolId = schoolAdmin!.school[0].id;
        const currentYear = new Date().getFullYear();


        const students = await prisma.student.findMany({
            where: { schoolId: schoolId },
            select: {
                id: true,
                name: true,
                fee: {
                    where: { year: currentYear },
                    select: {
                        paidAmount: true,
                        months: true,
                    },
                }
            },
        });

        const feeSummery: Record<number, any> = {};

        students.forEach((student) => {
            feeSummery[student.id] = {
                name: student.name,
                monthlyFee: {},
            }

            student.fee.forEach((fee) => {
                fee.months.forEach((month) => {
                    if (!feeSummery[student.id].monthlyFee[month]) {
                        feeSummery[student.id].monthlyFee[month] = 0;
                    }
                    feeSummery[student.id].monthlyFee[month] += ((fee.paidAmount ?? 0) / fee.months.length);
                });
            });
        });

        res.json({
            data: feeSummery
        });

    } catch (error) {
        next(error)
    }
});

router.get('/by-school', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN]);
        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.user?.id! },
            include: {
                school: true,
            }
        });

        if (schoolAdmin!.school?.length < 0) {
            throw new Error('School not found');
        }
        const fees = await prisma.fee.findMany({
            where: {
                schoolId: schoolAdmin!.school[0].id
            },
            include: {
                student: true,
                school: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ data: fees });

    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const { id } = req.params;
        const fee = await prisma.fee.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(fee);

    } catch (error) {
        next(error)
    }
});

router.post('/with-calclution', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            totalAmount,
            discountAmount,
            paidAmount,
            details,
            status,
            date,
            studentId,
            feeTypeId,
            months,
            year
        } = req.body;

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.user?.id! },
            include: {
                school: true
            }
        });

        const defaultSchoolId = schoolAdmin?.school[0].id

        const data: Prisma.FeeCreateInput = {
            totalAmount,
            discountAmount,
            paidAmount,
            details,
            status,
            date,
            months,
            year,
            school: {
                connect: {
                    id: defaultSchoolId
                }
            },
            student: {
                connect: {
                    id: parseInt(studentId)
                }
            }
        }

        if (feeTypeId) {
            data.feeType = {
                connect: {
                    id: parseInt(feeTypeId)
                }
            }
        }

        await prisma.$transaction(async (tx) => {
            const fee = await tx.fee.create({
                data
            });

            const accounts = await tx.accounts.findMany({
                where: {
                    schoolId: defaultSchoolId
                }
            });

            // Update the default account
            if (accounts.length > 0) {
                const account = accounts[0];
                await tx.accounts.update({
                    where: {
                        id: account.id
                    },
                    data: {
                        income: (account.expense || 0) + (fee.paidAmount || 0),
                        balance: (account.balance || 0) + (fee.paidAmount || 0)
                    }
                });
                console.log("Account updated");
            } else {
                // Create a new default account
                await tx.accounts.create({
                    data: {
                        name: "Default Account",
                        income: fee.paidAmount,
                        balance: fee.paidAmount,
                        defaultAccount: true,
                        school: {
                            connect: {
                                id: defaultSchoolId
                            }
                        }
                    }
                });

                console.log("Account created");
            }
        });

        res.json({ message: 'Fee created successfully' });

    } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const {
            totalAmount,
            discountAmount,
            paidAmount,
            details,
            status,
            date,
            schoolId,
            studentId,
        } = req.body;

        const fee = await prisma.fee.update({
            where: {
                id: parseInt(id)
            },
            data: {
                totalAmount,
                discountAmount,
                paidAmount,
                details,
                status,
                date,
                schoolId,
                studentId,
            }
        });
        res.json(fee);

    } catch (error) {
        next(error)
    }
});

export { router as feeRouter };