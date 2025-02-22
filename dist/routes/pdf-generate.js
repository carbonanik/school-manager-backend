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
const client_1 = require("@prisma/client");
const auth_1 = require("../util/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/student-card/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // isAuthenticated(req, [SCHOOL_ADMIN]) 
        const { id } = req.params;
        const student = yield prisma.student.findUnique({
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
                id: student === null || student === void 0 ? void 0 : student.id,
                name: student === null || student === void 0 ? void 0 : student.name,
                class: (_a = student === null || student === void 0 ? void 0 : student.class) === null || _a === void 0 ? void 0 : _a.name,
                school: (_b = student === null || student === void 0 ? void 0 : student.school) === null || _b === void 0 ? void 0 : _b.name,
                image: (student === null || student === void 0 ? void 0 : student.image) || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                barcode: "https://img.freepik.com/free-psd/barcode-illustration-isolated_23-2150584086.jpg"
            }
        });
    }
    catch (error) {
        console.error(error);
        throw new errors_1.HTTPError("Failed to render student card", 500);
    }
}));
router.get("/student-card-pdf/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, auth_1.isAuthenticated)(req, [auth_1.SCHOOL_ADMIN]);
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
        const pdfResponse = yield fetch('http://localhost:3030/forms/chromium/convert/url', {
            method: 'POST',
            body: formData
        });
        console.log(pdfResponse);
        const pdfBlob = yield pdfResponse.blob();
        const buffer = yield pdfBlob.arrayBuffer();
        res.setHeader('Content-Disposition', 'inline; filename="student-id.pdf"');
        res.setHeader('Content-Type', pdfBlob.type);
        res.send(Buffer.from(buffer));
    }
    catch (error) {
        throw new errors_1.HTTPError("Failed to render student card", 500);
    }
}));
exports.default = router;
