import { Router } from 'express';
import { authMiddleware, userController } from './setup';

export const privateRoutes = Router();

privateRoutes.use(authMiddleware.isAuthenticated.bind(authMiddleware));

privateRoutes.get('/user', userController.getUser.bind(userController));

privateRoutes.put('/user', userController.updateUser.bind(userController));

privateRoutes.delete('/user', userController.deleteUser.bind(userController));
