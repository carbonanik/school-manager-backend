export class HTTPError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = 'HTTPError';
    }
}

export class UnauthorizedError extends HTTPError {
    constructor() {
        super('Unauthorized', 401);
        this.name = 'UnauthorizedError';
    }
}

export class InvalidCredentialsError extends HTTPError {
    constructor() {
        super('Invalid credentials', 401);
        this.name = 'InvalidCredentialsError';
    }
}
