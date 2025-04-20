export class HTTPError extends Error {
    constructor(public status: number,message: string) {
        super(message);
        this.name = 'HTTPError';
    }
}

export class UnauthorizedError extends HTTPError {
    constructor() {
        super(401, 'Unauthorized');
        this.name = 'UnauthorizedError';
    }
}

export class InvalidCredentialsError extends HTTPError {
    constructor() {
        super(401, 'Invalid credentials');
        this.name = 'InvalidCredentialsError';
    }
}
