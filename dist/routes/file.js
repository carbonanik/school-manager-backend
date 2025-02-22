"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const minio_1 = require("minio");
const path_1 = __importDefault(require("path"));
const errors_1 = require("../util/errors");
const router = (0, express_1.Router)();
// Set up Multer to store files in memory
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const minioClient = new minio_1.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});
const bucketName = 'profile-pictures';
// Ensure the bucket exists (create it if it does not)
minioClient.bucketExists(bucketName).then((exists) => __awaiter(void 0, void 0, void 0, function* () {
    if (!exists) {
        yield minioClient.makeBucket(bucketName);
    }
    else {
        console.log(`Bucket "${bucketName}" already exists.`);
    }
}));
const checkForFileSize = false;
router.post('/upload', upload.single('fileUpload'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            throw new errors_1.HTTPError('No file uploaded', 400);
        }
        // send error if file size is greater than 1MB
        if (checkForFileSize && req.file.size > 1000000) {
            throw new errors_1.HTTPError('File size must be less than 1MB', 400);
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(req.file.originalname);
        const fileName = uniqueSuffix + ext;
        yield minioClient.putObject(bucketName, fileName, req.file.buffer, req.file.size, {
            'Content-Type': req.file.mimetype
        });
        // const objectUrl = await minioClient.presignedGetObject(bucketName, fileName);
        res.json({ message: 'File uploaded successfully', fileName });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/download/:fileName', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName } = req.params;
        const objectUrl = yield minioClient.presignedGetObject(bucketName, fileName);
        res.json({ objectUrl });
    }
    catch (error) {
        next(error);
    }
}));
// Serve a simple HTML form for testing purposes
router.get('/', (req, res) => {
    res.send(`
    <h2>Upload a Profile Picture</h2>
    <form action="/api/file/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="fileUpload" accept="image/*" required />
      <button type="submit">Upload</button>
    </form>
  `);
});
exports.default = router;
