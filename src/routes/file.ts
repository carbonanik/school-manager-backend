import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import { Client } from 'minio';
import path from 'path';
import { HTTPError } from '../util/errors';


const router = Router();

// Set up Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

const bucketName = 'profile-pictures';

// Ensure the bucket exists (create it if it does not)
async function ensureBucketExists() {
    try {
        let exists = await minioClient.bucketExists(bucketName);
        if (!exists) await minioClient.makeBucket(bucketName);
    } catch (error) {
        console.error('MinIO connection failed, retrying in 5 seconds...', error);
        setTimeout(ensureBucketExists, 5000);
    }
}

ensureBucketExists();

const checkForFileSize = false;

router.post('/upload', upload.single('fileUpload'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new HTTPError(400, 'No file uploaded');
        }
        // send error if file size is greater than 1MB
        if (checkForFileSize && req.file.size > 1000000) {
            throw new HTTPError(400, 'File size must be less than 1MB');
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(req.file.originalname);
        const fileName = uniqueSuffix + ext;

        await minioClient.putObject(bucketName, fileName, req.file.buffer, req.file.size, {
            'Content-Type': req.file.mimetype
        });

        // const objectUrl = await minioClient.presignedGetObject(bucketName, fileName);

        res.json({ message: 'File uploaded successfully', fileName });
    } catch (error) {
        next(error)
    }
});

router.get('/download/:fileName', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileName } = req.params;
        const objectUrl = await minioClient.presignedGetObject(bucketName, fileName);
        res.json({ objectUrl });
    } catch (error) {
        next(error)
    }
})

// Serve a simple HTML form for testing purposes
router.get('/', (req: Request, res: Response) => {
    res.send(`
    <h2>Upload a Profile Picture</h2>
    <form action="/api/file/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="fileUpload" accept="image/*" required />
      <button type="submit">Upload</button>
    </form>
  `);
});


export default router;