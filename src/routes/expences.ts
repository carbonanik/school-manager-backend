import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient()
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        const expences = await prisma.expense.findMany();
        res.json({ data: expences });
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
        })
        const expences = await prisma.expense.findMany(
            {
                where: {
                    schoolId: schoolAdmin?.school[0]?.id
                }
            }
        );
        res.json({ data: expences });
    } catch (error) {
        next(error)
    }
});


router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const {
            amount,
            details,
            status,
            date,
            schoolId,
        } = req.body;

        const expense = await prisma.expense.create({
            data: {
                amount,
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


router.post('/with-calclution', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN]);
        const {
            amount,
            details,
            date,
        } = req.body;

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where: { id: req.session.user?.id! },
            include: {
                school: true
            }
        });

        const defaultSchoolId = schoolAdmin?.school[0].id


        await prisma.$transaction(async (tx) => {
            const expense = await prisma.expense.create({
                data: {
                    amount,
                    details,
                    status: "Paid",
                    date,
                    school: {
                        connect: {
                            id: defaultSchoolId
                        }
                    }
                }
            });

            const accounts = await tx.accounts.findMany({
                where: {
                    schoolId: defaultSchoolId
                }
            });

            // find the account where defaultAccount is true
            // const defaultAccount = accounts.find(account => account.defaultAccount);

            if (accounts.length > 0) {
                const account = accounts[0];
                await tx.accounts.update({
                    where: {
                        id: account.id
                    },
                    data: {
                        expense: (account.expense || 0) + (expense.amount || 0),
                        balance: (account.balance || 0) - (expense.amount || 0)
                    }
                });
                console.log("Account updated");
            } else {
                // Create a new default account
                await tx.accounts.create({
                    data: {
                        name: "Default Account",
                        expense: expense.amount,
                        balance: -(expense.amount || 0),
                        defaultAccount: true,
                        school: {
                            connect: {
                                id: defaultSchoolId
                            }
                        }
                    }
                });
                console.log("Default account created");
            }
        });

        res.json({ message: 'Expense created successfully' });

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
            details,
            status,
            date,
            schoolId,
        } = req.body;

        const expense = await prisma.expense.update({
            where: {
                id: parseInt(id)
            },
            data: {
                amount,
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