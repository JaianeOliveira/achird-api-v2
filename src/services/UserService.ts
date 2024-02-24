import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import {
	CreateUserDTO,
	FindUserQueries,
	IUserService,
	UpdateUserDTO,
} from './interfaces/IUserService';
import { IGithubService } from './interfaces/IGithubService';
import { ConflictException, NotFoundException, UnauthorizedException } from '@/utils/Exceptions';
import { IJwtService } from './interfaces/IJWTService';

export class UserService implements IUserService {
	constructor(
		private userRepository: IUserRepository,
		private githubService: IGithubService,
		private jwtService: IJwtService,
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

	async delete(github_id: number) {
		const userExists = await this.userRepository.exists({
			github_id: github_id,
		});

		if (!userExists) {
			throw new NotFoundException('User not found');
		}

		await this.userRepository.delete(github_id);
	}

	async getUserAuthenticatedData(bearer_token: string): Promise<any> {
		if (!bearer_token) {
			throw new UnauthorizedException('Invalid token');
		}

		const token = bearer_token.split(' ')[1];

		const { github_access_token, github_user } = await this.jwtService.verify(token);

		const promises = [
			this.userRepository.find({ github_user }),
			this.githubService.getAuthenticatedUser(github_access_token),
		];
		const [database_data, github_data] = await Promise.all(promises);

		const utilData = {
			slug: database_data.slug,
			email: database_data.email,
			// TO ADD: page_is_public: database_data.page_is_public,
			page_is_public: true,
			social_accounts: database_data.social_accounts,
			github_user: database_data.github_user,
			avatar_url: github_data.user.avatar_url,
			// repositories: TO TO
			repositories: [],
			// theme: TO TO
			theme: 'default',
			// profissional_experience: TO DO
			profissional_experience: [],
		};

		return utilData;
	}

	async exists(queries: FindUserQueries) {
		return await this.userRepository.exists({ ...queries });
	}

	async getUser(slug: string): Promise<any> {
		const databaseUser = await this.userRepository.find({ slug });
		const githubUser = await this.githubService.getUser(databaseUser.github_user);

		const data = {
			...databaseUser,
			...githubUser,
		};

		return data;
	}

	async list() {
		const users = await this.userRepository.list();
		return users.map((user) => ({ github_user: user.github_user, slug: user.slug }));
	}
}
