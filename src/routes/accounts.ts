import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

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
        const accounts = await prisma.accounts.findMany({
            where: { schoolId: schoolAdmin?.school[0]?.id }
        });

        const fees = await prisma.fee.findMany({
            where: { schoolId: schoolAdmin?.school[0]?.id }
        });


        const expences = await prisma.expense.findMany({
            where: { schoolId: schoolAdmin?.school[0]?.id }
        });

        const thisMonthIncome = fees.filter((fee) => {
            const date = fee.date;
            return date?.getMonth() === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
        }).reduce((total, fee) => {
            return total + (fee.paidAmount || 0)
        }, 0);

        const thisMonthExpense = expences.filter((expence) => {
            const date = expence.date;
            return date?.getMonth() === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
        }).reduce((total, expence) => { return total + (expence.amount || 0) }, 0);

        const todayIncome = fees.filter((fee) => {
            const date = fee.date;
            return date?.getDate() === new Date().getDate()
                && date.getMonth() === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
        }).reduce((total, fee) => {
            return total + (fee.paidAmount || 0)
        }, 0);

        const todayExpense = expences.filter((expence) => {
            const date = expence.date;
            return date?.getDate() === new Date().getDate()
                && date.getMonth() === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
        }).reduce((total, expence) => {
            return total + (expence.amount || 0)
        }, 0);


        res.json({
            data: {
                thisMonthIncome: thisMonthIncome,
                thisMonthExpense: thisMonthExpense,
                todayIncome: todayIncome,
                todayExpense: todayExpense,
                totalIncome: accounts[0].income,
                totalExpense: accounts[0].expense,
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