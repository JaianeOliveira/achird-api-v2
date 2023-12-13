import { Router } from 'express';
import { authMiddleware, userController } from './setup';

export const privateRoutes = Router();

privateRoutes.get(
	'/user',
	authMiddleware.isAuthenticated.bind(authMiddleware),
	userController.getUser.bind(userController),
);
