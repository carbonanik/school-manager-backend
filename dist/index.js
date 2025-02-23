"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { studentRouter } from './routes/students';
// import { teacherRouter } from './routes/teachers';
// import { parentRouter } from './routes/parents';
// import { centralAdminRouter } from './routes/central_admin';
// import { schoolRouter } from './routes/schools';
// import { schoolAdminRouter } from './routes/school_admin';
// import { classRouter } from './routes/classes';
// import { lessonRouter } from './routes/lessons';
// import { subjectRouter } from './routes/subjects';
// import { attendenceRouter } from './routes/attendances';
const authentication_1 = require("./routes/authentication");
// import { accountsRouter } from './routes/accounts';
// import { feeRouter } from './routes/fees';
// import { feeTypeRouter } from './routes/fee-type'; 
// import { expenseRouter } from './routes/expences';
const errorHandleMiddleware_1 = require("./util/errorHandleMiddleware");
// import { sessionMiddleware } from './util/sessionMiddleware';
// import fileRouter from './routes/file';
// import pdfTempRouter from './routes/pdf-temp';
// import pdfGenerateRouter from './routes/pdf-generate';
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
const allowedOrigins = [
    'http://77.37.44.205:3000',
    'http://localhost:3000',
    'https://at-tahfiz-international-madrasha.com'
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Allow the request
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.set("view engine", "ejs");
// app.set('trust proxy', 1);
// app.use(sessionMiddleware);
// app.use('/api/students', studentRouter);
// app.use('/api/teachers', teacherRouter);
// app.use('/api/parents', parentRouter);
// app.use('/api/central-admin', centralAdminRouter);
// app.use('/api/schools', schoolRouter);
// app.use('/api/school-admin', schoolAdminRouter);
// app.use('/api/classes', classRouter);
// app.use('/api/lessons', lessonRouter);
// app.use('/api/subjects', subjectRouter);
// app.use('/api/attendances', attendenceRouter);
app.use('/api/authentication', authentication_1.authenticationRouter);
// declare module "express-session" {
//   interface SessionData {
//     user: User;
//   }
// }
app.get('/', (req, res) => {
    res.send('You found the API!');
});
app.use(errorHandleMiddleware_1.errorHandleMiddleware);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
