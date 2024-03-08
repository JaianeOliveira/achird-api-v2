import { Request, Response } from 'express';

export interface IAuthController {
	authenticate(req: Request, res: Response): Promise<void>;
}
