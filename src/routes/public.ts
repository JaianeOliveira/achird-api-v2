import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import docsV2 from '@/docs/swagger.json';
export const publicRouter = Router();

publicRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docsV2));

publicRouter.get('/', (_, res) => {
	res.send({
		message: `[${process.env.APP_NAME}] Welcome to V2!`,
		docs: '/v2/api-docs',
	});
});
