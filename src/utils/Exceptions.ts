export class Exception extends Error {
	public statusCode: number;
	public context?: string;
	public links?: Record<string, string>[];
	public timestamp?: string;
	public systemMessage?: string;

	constructor(
		statusCode: number,
		message?: string,
		systemMessage?: string,
		context?: string,
		links?: Record<string, string>[],
		timestamp?: string,
	) {
		super(message);
		this.statusCode = statusCode;
		this.systemMessage = systemMessage;
		this.context = context;
		this.links = links || [];
		this.timestamp = timestamp || new Date().toISOString();
	}
}

export class BadRequestException extends Exception {
	constructor(
		message?: string,
		systemMessage?: string,
		context?: string,
		links?: Record<string, string>[],
		timestamp?: string,
	) {
		super(400, message || 'Bad request', systemMessage, context, links, timestamp);
	}
}

export class UnauthorizedException extends Exception {
	constructor(
		message?: string,
		systemMessage?: string,
		context?: string,
		links?: Record<string, string>[],
		timestamp?: string,
	) {
		super(401, message || 'Unauthorized', systemMessage, context, links, timestamp);
	}
}

export class ForbiddenException extends Exception {
	constructor(
		message?: string,
		systemMessage?: string,
		context?: string,
		links?: Record<string, string>[],
		timestamp?: string,
	) {
		super(403, message || 'Forbidden', systemMessage, context, links, timestamp);
	}
}

export class NotFoundException extends Exception {
	constructor(
		message?: string,
		systemMessage?: string,
		context?: string,
		links?: Record<string, string>[],
		timestamp?: string,
	) {
		super(404, message || 'Not found', systemMessage, context, links, timestamp);
	}
}

export class ConflictException extends Exception {
	constructor(
		message?: string,
		systemMessage?: string,
		context?: string,
		links?: Record<string, string>[],
		timestamp?: string,
	) {
		super(409, message || 'Conflict', systemMessage, context, links, timestamp);
	}
}

export class InternalServerException extends Exception {
	constructor(
		message?: string,
		systemMessage?: string,
		context?: string,
		links?: Record<string, string>[],
		timestamp?: string,
	) {
		super(500, message || 'Internal server error', systemMessage, context, links, timestamp);
	}
}

export class NotImplementedException extends Exception {
	constructor(
		message?: string,
		systemMessage?: string,
		context?: string,
		links?: Record<string, string>[],
		timestamp?: string,
	) {
		super(501, message || 'Not implemented', systemMessage, context, links, timestamp);
	}
}
