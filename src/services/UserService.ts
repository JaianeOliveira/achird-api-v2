import { PageConfig } from '@/entities/User';
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
			throw new UnauthorizedException('Token not found');
		}

		const token = bearer_token.split(' ')[1];

		const { github_user } = await this.jwtService.verify(token);

		const data = await this.userRepository.findByGithubUser(github_user);

		if (!data) {
			throw new NotFoundException('User not found');
		}

		return data;
	}

	async exists(queries: FindUserQueries) {
		return await this.userRepository.exists({ ...queries });
	}

	async getPageData(slug: string): Promise<PublicProfileData> {
		const databaseUser = await this.userRepository.findBySlug(slug);
		const public_profile_data = DataMapper.pageDataDTO(databaseUser);

		return public_profile_data;
	}

	async list() {
		const users = await this.userRepository.list();
		return users.map((user) => user);
	}

	async updatePageConfig(bearer_token: string, data: Partial<PageConfig>) {
		if (!bearer_token) {
			throw new UnauthorizedException('Token not found');
		}

		const token = bearer_token.split(' ')[1];

		const { github_id } = await this.jwtService.verify(token);

		const user = await this.userRepository.findByGithubId(github_id);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		await this.userRepository.updatePageConfig(github_id, { ...user.page_config, ...data });
	}

	async updatePageData(bearer_token: string) {
		if (!bearer_token) {
			throw new UnauthorizedException('Token not found');
		}

		const token = bearer_token.split(' ')[1];

		const { github_access_token } = await this.jwtService.verify(token);

		const github_user_data = await this.githubService.getAuthenticatedUser(github_access_token);
		const github_user_repositories = await this.githubService.getRepositories(
			github_user_data.user.login,
		);

		const github_util_data = {
			name: github_user_data.user.name,
			bio: github_user_data.user.bio,
			avatar_url: github_user_data.user.avatar_url,
			email: github_user_data.user.email,
			github_user: github_user_data.user.login,
			github_id: github_user_data.user.id,
			social_accounts: github_user_data.social_accounts,
			repositories: github_user_repositories,
		};

		const user_data = DataMapper.updateUser(github_util_data);

		await this.userRepository.update(github_user_data.user.id, user_data);
	}
}
