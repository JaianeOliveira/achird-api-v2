import { IUserService } from '@/services/interfaces/IUserService';
import { handleErrors } from '@/utils/HandleErrors';
import { Request, Response } from 'express';
import { IUserController } from './interfaces/IUserController';

export class UserController implements IUserController {
	constructor(private userService: IUserService) {}

	async getPageData(req: Request, res: Response): Promise<void> {
		const slug = req.params.slug as string;
		handleErrors(req, res, () => this.userService.getPageData(slug));
	}

	async getUserAuthenticatedData(req: Request, res: Response): Promise<void> {
		const token = req.headers.authorization as string;

		handleErrors(req, res, () => this.userService.getUserAuthenticatedData(token));
	}

	async updateUser(req: Request, res: Response): Promise<void> {
		const github_id = Number(req.query.github_id);

		handleErrors(req, res, () => this.userService.update(github_id, req.body));
	}

	async deleteUser(req: Request, res: Response): Promise<void> {
		const github_id = Number(req.query.github_id);

		handleErrors(req, res, () => this.userService.delete(github_id));
	}

	async list(req: Request, res: Response) {
		handleErrors(req, res, () => this.userService.list());
	}

	async updatePageConfig(req: Request, res: Response): Promise<void> {
		const bearer_token = req.headers.authorization as string;
		const data = req.body;

		handleErrors(req, res, () => this.userService.updatePageConfig(bearer_token, data));
	}

	async updatePageData(req: Request, res: Response): Promise<void> {
		handleErrors(req, res, () => this.userService.updatePageData(req.body));
	}
}
