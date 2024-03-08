import { IAuthService } from '@/services/interfaces/IAuthService';
import { handleErrors } from '@/utils/HandleErrors';
import { Request, Response } from 'express';
import { IAuthController } from './interfaces/IAuthController';

export class AuthController implements IAuthController {
	constructor(private authService: IAuthService) {}
	async authenticate(req: Request, res: Response) {
		const code = req.query.code as string;
		const referer = (req.headers.referer as string) || (process.env.REDIRECT_URI as string);

		handleErrors(req, res, () => this.authService.authenticate(code, referer));
	}
}
