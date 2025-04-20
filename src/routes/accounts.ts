import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";
import { HTTPError } from "../util/errors";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const accounts = await prisma.accounts.findMany();
        res.json(accounts);

    } catch (error) {
        next(error)
    }
});

router.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.user?.id! },
            include: { school: true }
        });

        const schoolId = schoolAdmin?.school[0]?.id;

        if (!schoolId) {
            throw new HTTPError(500, 'School not found');
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [
            thisMonthIncome,
            thisMonthExpense,
            todayIncome,
            todayExpense,
            accounts,
            thisMonthFees
        ] = await Promise.all([
            prisma.fee.aggregate({ _sum: { paidAmount: true }, where: { schoolId, date: { gte: startOfMonth } } }),
            prisma.expense.aggregate({ _sum: { amount: true }, where: { schoolId, date: { gte: startOfMonth } } }),
            prisma.fee.aggregate({ _sum: { paidAmount: true }, where: { schoolId, date: { gte: startOfToday } } }),
            prisma.expense.aggregate({ _sum: { amount: true }, where: { schoolId, date: { gte: startOfToday } } }),
            prisma.accounts.findFirst({ where: { schoolId } }),
            prisma.fee.findMany({ where: { schoolId, date: { gte: startOfMonth } } })
        ]);

        // Compute feesByMonth efficiently using reduce
        const feesByMonth = thisMonthFees.reduce((acc, fee) => {
            const months = fee.months || [];
            const feeOfMonth = months.length ? (fee.paidAmount || 0) / months.length : fee.paidAmount || 0;

            months.forEach((month) => {
                acc[month] = (acc[month] || 0) + feeOfMonth;
            });

            return acc;
        }, {} as { [key: number]: number });

        res.json({
            data: {
                thisMonthIncome: thisMonthIncome._sum.paidAmount || 0,
                thisMonthExpense: thisMonthExpense._sum.amount || 0,
                todayIncome: todayIncome._sum.paidAmount || 0,
                todayExpense: todayExpense._sum.amount || 0,
                totalIncome: accounts?.income || 0,
                totalExpense: accounts?.expense || 0,
                feesByMonth,
            }
        });
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            name,
            schoolId,
        } = req.body;

        const accounts = await prisma.accounts.create({
            data: {
                name,
                schoolId,
            }
        });
        res.json(accounts);

    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const accounts = await prisma.accounts.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(accounts);

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
            schoolId,
        } = req.body;

        const accounts = await prisma.accounts.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                schoolId,
            }
        });
        res.json(accounts);

    } catch (error) {
        next(error)
    }
});

export { router as accountsRouter };