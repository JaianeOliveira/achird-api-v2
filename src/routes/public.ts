import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import docsV2 from '@/docs/swagger.json';
import { authController, userController } from './setup';
export const publicRouter = Router();
import dotenv from 'dotenv';

dotenv.config();

publicRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docsV2));

publicRouter.get('/', (_, res) => {
	res.send({
		message: `[${process.env.APP_NAME}] Welcome to V2!`,
		docs: '/api/v2/api-docs',
	});
});

publicRouter.get('/ping', (_, res) => {
	res.send({
		message: `[${process.env.APP_NAME}] Ping`,
	});
});

publicRouter.post('/auth/login', authController.login.bind(authController));
publicRouter.post('/auth/register', authController.register.bind(authController));

publicRouter.get('/auth/code', (req, res) => {
	const code = req.query.code;

	if (code) {
		res.json({ code });
	} else {
		const authUrl = `https://github.com/login/oauth/authorize?client_id=${
			process.env.GITHUB_CLIENT_ID
		}&redirect_uri=${req.protocol}://${req.headers.host || 'localhost'}/v2/auth/code&scope=user`;
		res.redirect(authUrl);
	}
});

publicRouter.get('/users', userController.list.bind(userController));
publicRouter.get('/user/:slug', userController.getPageData.bind(userController));
