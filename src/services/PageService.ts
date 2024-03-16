import { PageConfig } from '@/entities/User';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { DataMapper } from '@/utils/DataMapper';
import { NotFoundException, UnauthorizedException } from '@/utils/Exceptions';
import { IGithubService } from './interfaces/IGithubService';
import { IJwtService } from './interfaces/IJWTService';
import { IPageService } from './interfaces/IPageService';
import { PublicProfileData } from './interfaces/IUserService';

export class PageService implements IPageService {
	constructor(
		private userRepository: IUserRepository,
		private githubService: IGithubService,
		private jwtService: IJwtService,
	) {}

	async getPageData(slug: string): Promise<PublicProfileData> {
		const databaseUser = await this.userRepository.findBySlug(slug);

		if (!databaseUser) {
			throw new NotFoundException('User not found');
		}

		const public_profile_data = DataMapper.pageDataDTO(databaseUser);

		return public_profile_data;
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
