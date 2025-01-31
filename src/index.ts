import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import connectMemcached from 'connect-memcached';

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
import { HTTPError } from './util/errors';
import { errorHandleMiddleware } from './util/errorHandleMiddleware';
import { sessionMiddleware } from './util/sessionMiddleware';

dotenv.config();
const port = process.env.PORT || 3001;
const MemcachedStore = connectMemcached(session);

const app = express();

app.use(express.json());

app.use(sessionMiddleware);

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
app.use('/api/accounts', accountsRouter);

// Define User Type
interface User {
  id: number;
  username: string;
  role: string;
}

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

app.get('/', (req: Request, res: Response) => {
  res.send('You found the API!');
});

app.use(errorHandleMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});