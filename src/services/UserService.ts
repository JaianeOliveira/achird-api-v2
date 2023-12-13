import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import {
	CreateUserDTO,
	FindUserQueries,
	IUserService,
	UpdateUserDTO,
} from './interfaces/IUserService';
import { IGithubService } from './interfaces/IGithubService';
import { ConflictException, NotFoundException } from '@/utils/Exceptions';

export class UserService implements IUserService {
	constructor(
		private userRepository: IUserRepository,
		private githubService: IGithubService,
	) {}

	async create(data: CreateUserDTO) {
		const userExists = await this.userRepository.exists({
			github_id: data.github_id,
			email: data.email,
			github_user: data.github_user,
		});

		if (userExists) {
			throw new ConflictException('User already exists');
		}

		const date = new Date().toISOString();

		const newUserData = {
			...data,
			social_accounts: data.social_accounts || [],
			created_at: date,
			updated_at: date,
			slug: data.github_user.toLowerCase(),
		};

		await this.userRepository.create(newUserData);
	}
	async update(github_id: number, data: UpdateUserDTO): Promise<void> {
		const userExists = await this.userRepository.exists({
			github_id: github_id,
		});

		if (!userExists) {
			throw new NotFoundException('User not found');
		}

		await this.userRepository.update(github_id, data);
	}

	async getUserAuthenticatedData(token: string) {
		const data = await this.githubService.getAuthenticatedUser(token);

		return data;
	}

	async exists(queries: FindUserQueries) {
		return await this.userRepository.exists({ ...queries });
	}

	async getUser(github_user: string): Promise<any> {
		const databaseUser = await this.userRepository.find({ github_user });
		const githubUser = await this.githubService.getUser(github_user);

		return {
			...databaseUser,
			...githubUser,
		};
	}

	async list() {
		return await this.userRepository.list();
	}
}
