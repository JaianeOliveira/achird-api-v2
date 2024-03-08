import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { DataMapper } from '@/utils/DataMapper';
import { NotFoundException, UnauthorizedException } from '@/utils/Exceptions';
import { IGithubService } from './interfaces/IGithubService';
import { IJwtService } from './interfaces/IJWTService';
import {
	CreateUserDTO,
	FindUserQueries,
	IUserService,
	PublicProfileData,
	UpdateUserDTO,
} from './interfaces/IUserService';

export class UserService implements IUserService {
	constructor(
		private userRepository: IUserRepository,
		private githubService: IGithubService,
		private jwtService: IJwtService,
	) {}

	async create(data: CreateUserDTO) {
		const user_data = DataMapper.createUser(data);
		await this.userRepository.create(user_data);
	}
	async update(github_id: number, data: UpdateUserDTO): Promise<void> {
		console.log('UserService@update');

		const user_data = DataMapper.updateUser(data);

		await this.userRepository.update(github_id, user_data);
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
		console.log('UserService@getUserAuthenticatedData', bearer_token);

		if (!bearer_token) {
			throw new UnauthorizedException('Token not found');
		}

		const token = bearer_token.split(' ')[1];

		const { github_user } = await this.jwtService.verify(token);

		console.log(github_user);

		const data = await this.userRepository.find({
			github_user,
		});

		console.log(data);

		if (!data) {
			throw new NotFoundException('User not found');
		}

		return data;
	}

	async exists(queries: FindUserQueries) {
		return await this.userRepository.exists({ ...queries });
	}

	async getPublicProfile(slug: string): Promise<PublicProfileData> {
		const databaseUser = await this.userRepository.find({ slug });
		const githubUser = await this.githubService.getUser(databaseUser.github_user);
		const repos = await this.githubService.getRepositories(databaseUser.github_user);

		const data: PublicProfileData = {
			name: githubUser.name,
			email: databaseUser.email,
			avatar_url: githubUser.avatar_url,
			bio: githubUser.bio,
			github_user: databaseUser.github_user,
			github_profile_url: githubUser.html_url,
			social_accounts: databaseUser.social_accounts,
			profissional_experience: [],
			repositories: repos,
		};

		return data;
	}

	async list() {
		const users = await this.userRepository.list();
		return users.map((user) => user);
	}
}
