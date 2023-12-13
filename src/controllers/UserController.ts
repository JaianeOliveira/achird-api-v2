import { IUserService } from '@/services/interfaces/IUserService';
import { IUserController } from './interfaces/IUserController';
import { Request, Response } from 'express';
import { handleErrors } from '@/utils/HandleErrors';

export class UserController implements IUserController {
	constructor(private userService: IUserService) {}

	async getPageData(req: Request, res: Response): Promise<void> {
		const github_user = req.query.github_user as string;

		handleErrors(req, res, () => this.userService.getUser(github_user));
	}

	async getUser(req: Request, res: Response): Promise<void> {
		const token = req.headers.authorization as string;

		handleErrors(req, res, () => this.userService.getUserAuthenticatedData(token));
	}

	async updateUser(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async deleteUser(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async list(req: Request, res: Response) {
		handleErrors(req, res, () => this.userService.list());
	}
}
