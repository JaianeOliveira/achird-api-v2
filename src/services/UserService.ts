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
		if (!bearer_token) {
			throw new UnauthorizedException('Invalid token');
		}

		const token = bearer_token.split(' ')[1];

		const { github_access_token, github_user } = await this.jwtService.verify(token);

		const promises = [
			this.userRepository.find({ github_user }),
			this.githubService.getAuthenticatedUser(github_access_token),
			this.githubService.getRepositories(github_user),
		];
		const [database_data, github_data, repositories] = await Promise.all(promises);

		const utilData = {
			name: github_data.user.name,
			slug: database_data.slug,
			email: database_data.email,
			page_is_public: database_data.page_is_public,
			social_accounts: database_data.social_accounts,
			github_user: database_data.github_user,
			avatar_url: github_data.user.avatar_url,
			repositories,
			theme: database_data.theme,
			profissional_experience: database_data.profissional_experience,
		};

		return utilData;
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
		return users.map((user) => ({ github_user: user.github_user, slug: user.page_config.slug }));
	}
}
