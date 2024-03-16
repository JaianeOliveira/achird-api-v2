import { Request, Response } from 'express';

export interface IUserController {
	getUserAuthenticatedData(req: Request, res: Response): Promise<void>;
	updateUser(req: Request, res: Response): Promise<void>;
	deleteUser(req: Request, res: Response): Promise<void>;
	list(req: Request, res: Response): Promise<void>;
}
