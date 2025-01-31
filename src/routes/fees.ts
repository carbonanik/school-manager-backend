import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)

        const fees = await prisma.fee.findMany();
        res.json(fees);

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
            studentId,
        } = req.body;

        const fee = await prisma.fee.create({
            data: {
                amount,
                totalAmount,
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

        const fee = await prisma.fee.update({
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
                studentId,
            }
        });
        res.json(fee);

    } catch (error) {
        next(error)
    }
});

export { router as feeRouter };