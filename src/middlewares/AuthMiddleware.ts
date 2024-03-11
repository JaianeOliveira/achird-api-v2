import { IJwtService } from '@/services/interfaces/IJWTService';
import { Exception, UnauthorizedException } from '@/utils/Exceptions';
import { NextFunction, Request, Response } from 'express';

export class AuthMiddleware {
	constructor(private jwtService: IJwtService) {}

	async isAuthenticated(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.authorization;

			if (!token) {
				throw new UnauthorizedException('Token not found');
			}

			const tokenIsValid = await this.jwtService.verify(token.split(' ')[1]);

			if (!tokenIsValid) {
				throw new UnauthorizedException('Token invalid');
			} else {
				next();
			}
		} catch (error) {
			if (error instanceof Exception) {
				res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
			} else if (error instanceof Error) {
				res.status(500).json({ message: error.message, statusCode: 500 });
			} else {
				res.status(500).json({ message: 'Internal server error', statusCode: 500 });
			}
		}
	}
}
