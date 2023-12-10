import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { publicRouter } from '@/routes/public';

dotenv.config();

const port = Number(process.env.PORT) || 3333;

const app = express();

// middlewares
app.use(json());
app.use(cors());

// routes
app.use('/v2', publicRouter);
app.get('/', (req, res) => {
	res.redirect('/v2');
});

app.listen(port, () => {
	console.log(`[${process.env.APP_NAME}] Server is running on port http://localhost:${port}`);
});
