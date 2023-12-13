import { Request, Response } from 'express';
import { IAuthController } from './interfaces/IAuthController';
import { handleErrors } from '@/utils/HandleErrors';
import { IAuthService } from '@/services/interfaces/IAuthService';

export class AuthController implements IAuthController {
	constructor(private authService: IAuthService) {}
	async login(req: Request, res: Response) {
		const code = req.query.code as string;
		const referer = (req.headers.referer as string) || (process.env.REDIRECT_URI as string);

		handleErrors(req, res, () => this.authService.login(code, referer));
	}
	async register(req: Request, res: Response) {
		const code = req.query.code as string;
		const referer = (req.headers.referer as string) || (process.env.REDIRECT_URI as string);
		handleErrors(req, res, () => this.authService.register(code, referer));
	}
}
