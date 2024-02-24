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

	async getUserAuthenticatedData(token: string) {
		if (!token) {
			throw new UnauthorizedException('Invalid token');
		}

		const { github_access_token, github_user } = await this.jwtService.verify(token.split(' ')[1]);

		const promises = [this.userRepository.find({ github_user })];
		const [database_data] = await Promise.all(promises);
		return {
			...database_data,
		};
	}

	async exists(queries: FindUserQueries) {
		return await this.userRepository.exists({ ...queries });
	}

	async getUser(slug: string): Promise<any> {
		const databaseUser = await this.userRepository.find({ slug });
		const githubUser = await this.githubService.getUser(databaseUser.github_user);

		return {
			...databaseUser,
			...githubUser,
		};
	}

	async list() {
		const users = await this.userRepository.list();
		return users.map((user) => ({ github_user: user.github_user, slug: user.slug }));
	}
}
