import { Router } from "express";
import { HTTPError } from "../util/errors";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated, SCHOOL_ADMIN } from "../util/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/student-card/:id", async (req, res) => {
    try {

        // isAuthenticated(req, [SCHOOL_ADMIN]) 
        const { id } = req.params;

        const student = await prisma.student.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                class: true,
                school: true,
            }
        });

        res.render("student-id-card", {
            student: {
                id: student?.id,
                name: student?.name,
                class: student?.class?.name,
                school: student?.school?.name,
                image: student?.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                barcode: "https://img.freepik.com/free-psd/barcode-illustration-isolated_23-2150584086.jpg"
            }
        });
    } catch (error) {
        console.error(error);
        throw new HTTPError(500, "Failed to render student card");
    }
});

router.get("/student-card-pdf/:id", async (req, res) => {
    try {

        isAuthenticated(req, [SCHOOL_ADMIN])
        const { id } = req.params;

        const formData = new FormData();
        formData.append('url', "http://host.docker.internal:3001/api/pdf-generate/student-card/" + id);
        // formData.append('paperWidth', '2.12');
        // formData.append('paperHeight', '3.37');
        formData.append('marginTop', '0');
        formData.append('marginBottom', '0');
        formData.append('marginLeft', '0');
        formData.append('marginRight', '0');
        formData.append('singlePage', 'true');
        // formData.append('landscape', 'true');

        const pdfResponse = await fetch('http://localhost:3030/forms/chromium/convert/url', {
            method: 'POST',
            body: formData
        });

        console.log(pdfResponse);

        const pdfBlob = await pdfResponse.blob();

        const buffer = await pdfBlob.arrayBuffer();
        res.setHeader('Content-Disposition', 'inline; filename="student-id.pdf"');
        res.setHeader('Content-Type', pdfBlob.type);
        res.send(Buffer.from(buffer));


    } catch (error) {
        throw new HTTPError(500, "Failed to render student card");
    }
});

export default router;
