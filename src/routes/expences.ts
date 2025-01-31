import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const expences = await prisma.expense.findMany();
        res.json(expences);
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            amount,
            totalAmount,
            paidAmount,
            details,
            status,
            date,
            schoolId,
        } = req.body;

        const expense = await prisma.expense.create({
            data: {
                amount,
                totalAmount,
                paidAmount,
                details,
                status,
                date,
                schoolId,
            }
        });
        res.json(expense);

    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)
        const { id } = req.params;
        const expense = await prisma.expense.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.json(expense);

    } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;
        const {
            amount,
            totalAmount,
            paidAmount,
            details,
            status,
            date,
            schoolId,
            studentId,
        } = req.body;

        const expense = await prisma.expense.update({
            where: {
                id: parseInt(id)
            },
            data: {
                amount,
                totalAmount,
                paidAmount,
                details,
                status,
                date,
                schoolId,
            }
        });
        res.json(expense);

    } catch (error) {
        next(error)
    }
});

export { router as expenseRouter };