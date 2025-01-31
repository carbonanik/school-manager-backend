"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandleMiddleware = void 0;
const errors_1 = require("./errors");
var errorHandleMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof errors_1.HTTPError) {
        res.status(err.status).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: 'Something went wrong!' });
};
exports.errorHandleMiddleware = errorHandleMiddleware;
