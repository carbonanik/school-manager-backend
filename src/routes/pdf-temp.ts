import { Router } from "express";
import { HTTPError } from "../util/errors";


const router = Router();

router.get("/generate", async (req, res, next) => {
    try {

        var pdfResponse: Response;
        try {

            const formData = new FormData();
            formData.append('url', 'http://host.docker.internal:3001/api/pdf-temp/student-id');
            formData.append('paperWidth', '2.12');
            formData.append('paperHeight', '3.37');
            formData.append('marginTop', '0');
            formData.append('marginBottom', '0');
            formData.append('marginLeft', '0');
            formData.append('marginRight', '0');
            formData.append('singlePage', 'true');
            // formData.append('landscape', 'true');

            pdfResponse = await fetch('http://localhost:3030/forms/chromium/convert/url', {
                method: 'POST',
                body: formData
            });

            console.log("PDF generated");
        } catch (error) {
            console.log(error);
            throw new HTTPError(500, 'Failed to generate PDF');
        }

        var uploadResponse: Response;
        var pdfBlob: Blob;
        try {
            pdfBlob = await pdfResponse.blob();
            const file = new File([pdfBlob], "student-id.pdf", { type: pdfBlob.type });

            const formData = new FormData();
            formData.append('fileUpload', file);

            uploadResponse = await fetch("http://localhost:3001/api/file/upload", {
                method: 'POST',
                body: formData
            });
            console.log("PDF uploaded");
        } catch (error) {
            throw new HTTPError(500, 'Failed to upload PDF');
        }

        const buffer = await pdfBlob.arrayBuffer();
        res.setHeader('Content-Disposition', 'inline; filename="student-id.pdf"');
        res.setHeader('Content-Type', pdfBlob.type);
        res.send(Buffer.from(buffer));
    } catch (error) {
        next(error)
    }
});

router.get("/student-id", async (req, res) => {
    const photoUrl = "http://localhost:9000/profile-pictures/avatar.jpg";
    const barcodeUrl = "http://localhost:9000/profile-pictures/avatar.jpg";

    // get the image and convert it to base64
    // const photoBase64 = await convertImageToBase64(photoUrl);
    // const barcodeBase64 = await convertImageToBase64(barcodeUrl);

    const studentData = {
        name: "John Doe",
        id: "ST123456",
        course: "Computer Science",
        year: "2025",
        institute: "ABC University",
        photo: photoUrl,
        barcode: barcodeUrl,
    };
    res.render("student-id", { student: studentData });
});

router.get('/student-ids', (req, res) => {
    const studentImage = 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8zMF8zZF9yZW5kZXJfY2hhcmFjdGVyX29mX2FfZnVsbF9ib2R5X29mX2JsYWNrX18xY2YwNGQ4My0yMDk2LTQxMjAtOTlhYi0yYTgzYTgzMjdjN2EucG5n.png';
    const barcodeImage = 'https://img.freepik.com/free-psd/barcode-illustration-isolated_23-2150584086.jpg'
    const student1 = {
        photo: studentImage,
        name: 'John Doe',
        id: '12345',
        course: 'Computer Science',
        year: '2nd Year',
        institute: 'XYZ University',
        barcode: barcodeImage
    };
    const student2 = {
        photo: studentImage,
        name: 'Jane Smith',
        id: '67890',
        course: 'Mathematics',
        year: '3rd Year',
        institute: 'XYZ University',
        barcode: barcodeImage
    };
    // Define student3, student4, student5, student6 similarly
    const student3 = {
        photo: studentImage,
        name: 'John Doe',
        id: '12345',
        course: 'Computer Science',
        year: '2nd Year',
        institute: 'XYZ University',
        barcode: barcodeImage
    };
    const student4 = {
        photo: studentImage,
        name: 'Jane Smith',
        id: '67890',
        course: 'Mathematics',
        year: '3rd Year',
        institute: 'XYZ University',
        barcode: barcodeImage
    }
    const student5 = {
        photo: studentImage,
        name: 'John Doe',
        id: '12345',
        course: 'Computer Science',
        year: '2nd Year',
        institute: 'XYZ University',
        barcode: barcodeImage
    };
    const student6 = {
        photo: studentImage,
        name: 'Jane Smith',
        id: '67890',
        course: 'Mathematics',
        year: '3rd Year',
        institute: 'XYZ University',
        barcode: barcodeImage
    };

    res.render('multiple-id-cards', { student1, student2, student3, student4, student5, student6 });
});


export default router;

async function convertImageToBase64(imageUrl: string) {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:image/png;base64,${base64}`;
}
