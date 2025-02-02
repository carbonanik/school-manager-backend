// import express, { Request, Response } from 'express';
// import multer from 'multer';
// import { Client } from 'minio';
// import path from 'path';

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Set up Multer to store files in memory
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Configure your Minio client
// const minioClient = new Client({
//   endPoint: 'YOUR_MINIO_ENDPOINT', // e.g., 'localhost'
//   port: 9000,                      // update if needed
//   useSSL: false,                   // set to true if using SSL
//   accessKey: 'YOUR_ACCESS_KEY',
//   secretKey: 'YOUR_SECRET_KEY'
// });

// // Define the bucket name where files will be stored
// const bucketName = 'profile-pictures';

// // Ensure the bucket exists (create it if it does not)
// minioClient.bucketExists(bucketName, (err, exists) => {
//   if (err) {
//     console.error('Error checking bucket existence:', err);
//   } else if (!exists) {
//     minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
//       if (err) {
//         return console.error('Error creating bucket:', err);
//       }
//       console.log(`Bucket "${bucketName}" created successfully.`);
//     });
//   } else {
//     console.log(`Bucket "${bucketName}" already exists.`);
//   }
// });

// // Create the file upload endpoint
// app.post('/upload', upload.single('profilePic'), (req: Request, res: Response) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   // Create a unique filename (you can customize this as needed)
//   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//   const ext = path.extname(req.file.originalname);
//   const fileName = uniqueSuffix + ext;

//   // Upload the file buffer to Minio
//   minioClient.putObject(bucketName, fileName, req.file.buffer, req.file.size, (err, etag) => {
//     if (err) {
//       console.error('Error uploading file to Minio:', err);
//       return res.status(500).json({ error: 'Error uploading file' });
//     }
//     res.json({
//       message: 'File uploaded successfully to Minio',
//       fileName,
//       etag,
//     });
//   });
// });

// // (Optional) Serve a simple HTML form for testing purposes
// app.get('/', (req: Request, res: Response) => {
//   res.send(`
//     <h2>Upload a Profile Picture</h2>
//     <form action="/upload" method="post" enctype="multipart/form-data">
//       <input type="file" name="profilePic" accept="image/*" required />
//       <button type="submit">Upload</button>
//     </form>
//   `);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
