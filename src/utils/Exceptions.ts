export class Exception extends Error {
	public statusCode: number;
	constructor(statusCode: number, message?: string) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class BadRequestException extends Exception {
	constructor(message?: string) {
		super(400, message || 'Bad request');
	}
}

export class UnauthorizedException extends Exception {
	constructor(message?: string) {
		super(401, message || 'Unauthorized');
	}
}

export class ForbiddenException extends Exception {
	constructor(message?: string) {
		super(403, message || 'Forbidden');
	}
}

export class NotFoundException extends Exception {
	constructor(message?: string) {
		super(404, message || 'Not found');
	}
}

export class ConflictException extends Exception {
	constructor(message?: string) {
		super(409, message || 'Conflict');
	}
}

export class InternalServerException extends Exception {
	constructor(message?: string) {
		super(500, message || 'Internal server error');
	}
}

export class NotImplementedException extends Exception {
	constructor(message?: string) {
		super(501, message || 'Not implemented');
	}
}
