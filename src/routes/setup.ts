import { UserService } from './../services/UserService';
import { AuthController } from '@/controllers/AuthController';
import { UserController } from '@/controllers/UserController';
import { AuthMiddleware } from '@/middlewares/AuthMiddleware';
import { UserMemoryRepository } from '@/repositories/UserMemoryRepository';
import { AuthService } from '@/services/AuthService';
import { GithubService } from '@/services/GithubService';
import { JwtService } from '@/services/JWTService';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const api = axios.create();

export const userMemoryRepository = new UserMemoryRepository();

export const githubService = new GithubService(api);
export const userService = new UserService(userMemoryRepository, githubService);
export const jwtService = new JwtService();
export const authService = new AuthService(githubService, userService, jwtService);

export const authController = new AuthController(authService);
export const userController = new UserController(userService);

export const authMiddleware = new AuthMiddleware(jwtService);
