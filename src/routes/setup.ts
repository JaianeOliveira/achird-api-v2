import { AuthController } from '@/controllers/AuthController';
import { UserController } from '@/controllers/UserController';
import { AuthMiddleware } from '@/middlewares/AuthMiddleware';
import { UserMemoryRepository } from '@/repositories/UserMemoryRepository';
import { UserMongoRepository } from '@/repositories/UserMongoRepository';
import { AuthService } from '@/services/AuthService';
import { GithubService } from '@/services/GithubService';
import { JwtService } from '@/services/JWTService';
import { MongoService } from '@/services/MongoService';
import axios from 'axios';
import dotenv from 'dotenv';
import { UserService } from './../services/UserService';

dotenv.config();

const database_uri = process.env.DATABASE_URL || '';

const api = axios.create();

export const userMemoryRepository = new UserMemoryRepository();

export const mongoService = new MongoService(database_uri);
export const userMongoRepository = new UserMongoRepository(mongoService);

export const githubService = new GithubService(api);
export const jwtService = new JwtService();
export const userService = new UserService(userMemoryRepository, githubService, jwtService);
export const authService = new AuthService(githubService, userService, jwtService);

export const authController = new AuthController(authService);
export const userController = new UserController(userService);

export const authMiddleware = new AuthMiddleware(jwtService);
