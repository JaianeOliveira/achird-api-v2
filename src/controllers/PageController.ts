import { IPageService } from '@/services/interfaces/IPageService';
import { handleErrors } from '@/utils/HandleErrors';
import { Request, Response } from 'express';
import { IPageController } from './interfaces/IPageController';

export class PageController implements IPageController {
	constructor(private pageService: IPageService) {}

	async getPageData(req: Request, res: Response): Promise<void> {
		const slug = req.params.slug as string;
		handleErrors(req, res, () => this.pageService.getPageData(slug));
	}

	async updatePageConfig(req: Request, res: Response): Promise<void> {
		const bearer_token = req.headers.authorization as string;
		const data = req.body;

		handleErrors(req, res, () => this.pageService.updatePageConfig(bearer_token, data));
	}

	async updatePageData(req: Request, res: Response): Promise<void> {
		handleErrors(req, res, () => this.pageService.updatePageData(req.body));
	}
}
