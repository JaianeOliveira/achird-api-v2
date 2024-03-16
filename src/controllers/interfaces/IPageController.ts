import { Request, Response } from 'express';

export interface IPageController {
	getPageData(req: Request, res: Response): Promise<void>;
	updatePageConfig(req: Request, res: Response): Promise<void>;
}
