"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = exports.UnauthorizedError = exports.HTTPError = void 0;
class HTTPError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'HTTPError';
    }
}
exports.HTTPError = HTTPError;
class UnauthorizedError extends HTTPError {
    constructor() {
        super('Unauthorized', 401);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class InvalidCredentialsError extends HTTPError {
    constructor() {
        super('Invalid credentials', 401);
        this.name = 'InvalidCredentialsError';
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
