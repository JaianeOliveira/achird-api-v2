import { Router } from 'express';
import { authMiddleware, userController } from './setup';

export const privateRoutes = Router();

privateRoutes.use(authMiddleware.isAuthenticated.bind(authMiddleware));

privateRoutes.get('/user', userController.getUserAuthenticatedData.bind(userController));

privateRoutes.put('/user', userController.updateUser.bind(userController));
privateRoutes.put('/page-config', userController.updatePageConfig.bind(userController));
privateRoutes.put('/page-data', userController.updatePageData.bind(userController));

privateRoutes.delete('/user', userController.deleteUser.bind(userController));
