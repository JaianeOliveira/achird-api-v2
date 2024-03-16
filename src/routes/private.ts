import { Router } from 'express';
import { authMiddleware, pageController, userController } from './setup';

export const privateRoutes = Router();

privateRoutes.use(authMiddleware.isAuthenticated.bind(authMiddleware));

privateRoutes.get('/user', userController.getUserAuthenticatedData.bind(userController));

privateRoutes.put('/user', userController.updateUser.bind(userController));
privateRoutes.put('/page-config', pageController.updatePageConfig.bind(pageController));
privateRoutes.put('/page-data', pageController.updatePageData.bind(pageController));

privateRoutes.delete('/user', userController.deleteUser.bind(userController));
