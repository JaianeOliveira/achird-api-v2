import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';

import { publicRouter } from '@/routes/public';
import morgan from 'morgan';
import { privateRoutes } from './routes/private';

dotenv.config();

const port = Number(process.env.PORT) || 3333;

const app = express();

// middlewares
app.use(json());
app.use(cors());
app.use(morgan('dev'));

// routes

app.use('/api/v2', publicRouter);
app.use('/api/v2', privateRoutes);

app.listen(port, () => {
	console.log(
		`[${process.env.APP_NAME}] Server is running on port http://localhost:${port} \n Access http://localhost:${port}/api/v2/api-docs to see the documentation`,
	);
});
