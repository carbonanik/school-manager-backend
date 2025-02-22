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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errors_1 = require("../util/errors");
const router = (0, express_1.Router)();
router.get("/generate", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var pdfResponse;
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
            pdfResponse = yield fetch('http://localhost:3030/forms/chromium/convert/url', {
                method: 'POST',
                body: formData
            });
            console.log("PDF generated");
        }
        catch (error) {
            console.log(error);
            throw new errors_1.HTTPError('Failed to generate PDF', 500);
        }
        var uploadResponse;
        var pdfBlob;
        try {
            pdfBlob = yield pdfResponse.blob();
            const file = new File([pdfBlob], "student-id.pdf", { type: pdfBlob.type });
            const formData = new FormData();
            formData.append('fileUpload', file);
            uploadResponse = yield fetch("http://localhost:3001/api/file/upload", {
                method: 'POST',
                body: formData
            });
            console.log("PDF uploaded");
        }
        catch (error) {
            throw new errors_1.HTTPError('Failed to upload PDF', 500);
        }
        const buffer = yield pdfBlob.arrayBuffer();
        res.setHeader('Content-Disposition', 'inline; filename="student-id.pdf"');
        res.setHeader('Content-Type', pdfBlob.type);
        res.send(Buffer.from(buffer));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/student-id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
router.get('/student-ids', (req, res) => {
    const studentImage = 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8zMF8zZF9yZW5kZXJfY2hhcmFjdGVyX29mX2FfZnVsbF9ib2R5X29mX2JsYWNrX18xY2YwNGQ4My0yMDk2LTQxMjAtOTlhYi0yYTgzYTgzMjdjN2EucG5n.png';
    const barcodeImage = 'https://img.freepik.com/free-psd/barcode-illustration-isolated_23-2150584086.jpg';
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
    };
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
exports.default = router;
function convertImageToBase64(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(imageUrl);
        const buffer = yield response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64}`;
    });
}
