import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { studentRouter } from './routes/students';
import { teacherRouter } from './routes/teachers';
import { parentRouter } from './routes/parents';
import { centralAdminRouter } from './routes/central_admin';
import { schoolRouter } from './routes/schools';
import { schoolAdminRouter } from './routes/school_admin';
import { classRouter } from './routes/classes';
import { lessonRouter } from './routes/lessons';
import { subjectRouter } from './routes/subjects';
import { attendenceRouter } from './routes/attendances';
import { authenticationRouter } from './routes/authentication';
import { accountsRouter } from './routes/accounts';
import { feeRouter } from './routes/fees';
import { feeTypeRouter } from './routes/fee-type';
import { expenseRouter } from './routes/expences';
import { errorHandleMiddleware } from './util/errorHandleMiddleware';
// import { sessionMiddleware } from './util/sessionMiddleware';
import fileRouter from './routes/file';
import pdfTempRouter from './routes/pdf-temp';
import pdfGenerateRouter from './routes/pdf-generate';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 3001;

const app = express();

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
const allowedOrigins = [
  'http://77.37.44.205:3000',
  'http://localhost:3000',
  'https://at-tahfiz-international-madrasha.com',
  'https://dashboard.at-tahfiz-international-madrasha.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());

app.use(express.json());

app.set("view engine", "ejs");
// app.set('trust proxy', 1);

// app.use(sessionMiddleware);

app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/parents', parentRouter);
app.use('/api/central-admin', centralAdminRouter);
app.use('/api/schools', schoolRouter);
app.use('/api/school-admin', schoolAdminRouter);
app.use('/api/classes', classRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/attendances', attendenceRouter);
app.use('/api/authentication', authenticationRouter);
app.use('/api/fees', feeRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/file', fileRouter);
app.use('/api/pdf-temp', pdfTempRouter);
app.use('/api/pdf-generate', pdfGenerateRouter);
app.use('/api/fee-types', feeTypeRouter);

// Define User Type
interface User {
  id: number;
  authId: number;
  username: string;
  role: string;
}

declare module "express" {
  export interface Request {
    user?: User;
  }
}

// declare module "express-session" {
//   interface SessionData {
//     user: User;
//   }
// }

app.get('/', (req: Request, res: Response) => {
  res.send('You found the API!');
});

app.use(errorHandleMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});