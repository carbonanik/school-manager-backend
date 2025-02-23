import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CENTRAL_ADMIN, isAuthenticated, PARENT, SCHOOL_ADMIN, STUDENT, TEACHER } from "../util/auth";
import { HTTPError, InvalidCredentialsError } from "../util/errors";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()
const router = Router();

export const SECRET_KEY = 'your-secret-key';



router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            username,
            password,
            remember,
        } = req.body;

        var auth = await prisma.authInfo.findUnique({
            where: { username },
            include: {
                CentralAdmin: true,
                SchoolAdmin: true,
                Teacher: true,
                Parent: true,
                Student: true
            },
        });

        if (!auth) {
            throw new InvalidCredentialsError();
        }

        if (!bcrypt.compareSync(password, auth.password)) {
            throw new InvalidCredentialsError();
        }

        // if (remember) {
        //     req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds
        // }

        var userId;
        var userRole;

        if (auth.CentralAdmin) {
            userId = auth.CentralAdmin.id;
            userRole = CENTRAL_ADMIN;
        } else if (auth.SchoolAdmin) {
            userId = auth.SchoolAdmin.id;
            userRole = SCHOOL_ADMIN;
        } else if (auth.Teacher) {
            userId = auth.Teacher.id;
            userRole = TEACHER;
        } else if (auth.Parent) {
            userId = auth.Parent.id;
            userRole = PARENT;
        } else if (auth.Student) {
            userId = auth.Student.id;
            userRole = STUDENT;
        }

        if (!userId || !userRole) {
            throw new InvalidCredentialsError();
        }

        const user = {
            id: userId,
            username: auth.username,
            role: userRole
        }

        const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });

        // req.session.user = {
        //     id: userId,
        //     username: auth!.username,
        //     role: userRole,
        // };
        // req.session.save();
        res.json({ message: 'Login successful', user, token });

    } catch (error) {
        next(error)
    }
});

router.get('/name', async (req: Request, res: Response, next: NextFunction) => {
    try {

        isAuthenticated(req)

        res.json({ message: 'Welcome', user: req?.user });

    } catch (error) {
        next(error)
    }
})

router.get('/get-user', (req: Request, res: Response, next: NextFunction) => {
    try {
        isAuthenticated(req)
        console.log("req.user")
        res.json({ message: 'Welcome', user: req.user });
    } catch (error) {
        next(error)
    }
});

// router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
//     try {
//         req.session.destroy((err) => {
//             if (err) {
//                 console.error(err);
//                 throw new HTTPError('Logout failed', 500);
//             }
//             res.clearCookie("connect.sid", {
//                 path: "/",
//                 httpOnly: true,
//                 secure: false, // Set to true in production (if using HTTPS)
//                 sameSite: "lax",
//             });
//             res.json({ message: 'Logout successful' });
//         });

//     } catch (error) {
//         next(error)
//     }
// });


export { router as authenticationRouter };