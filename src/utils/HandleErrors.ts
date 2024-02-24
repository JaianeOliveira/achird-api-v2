import { Request, Response } from 'express';
import { Exception } from './Exceptions';

export async function handleErrors(req: Request, res: Response, callback: () => Promise<any>) {
	try {
		const returnData = await callback();
		res.json(returnData);
	} catch (err) {
		if (err instanceof Exception) {
			res.status(err.statusCode).json({
				message: err.message,
				statusCode: err.statusCode,
				context: err.context,
				links: err.links,
				timestamp: err.timestamp,
			});
		} else if (err instanceof Error) {
			res.status(500).json({
				message: err.message,
				statusCode: 500,
				context: '',
				links: [],
				timestamp: new Date().toISOString(),
			});
		} else {
			res.status(500).json({
				message: 'Internal server error',
				statusCode: 500,
				context: '',
				links: [],
				timestamp: new Date().toISOString(),
			});
		}
	}
}
