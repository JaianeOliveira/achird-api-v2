import { UserService } from './../services/UserService';
import { AuthController } from '@/controllers/AuthController';
import { UserMemoryRepository } from '@/repositories/UserMemoryRepository';
import { AuthService } from '@/services/AuthService';
import { GithubService } from '@/services/GithubService';
import axios from 'axios';

const api = axios.create();

export const userMemoryRepository = new UserMemoryRepository();

export const githubService = new GithubService(api);
export const userService = new UserService(userMemoryRepository, githubService);
export const authService = new AuthService(githubService, userService);

export const authController = new AuthController(authService);
