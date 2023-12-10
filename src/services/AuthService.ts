import { BadRequestException, ConflictException, NotFoundException } from '@/utils/Exceptions';
import { IAuthService } from './interfaces/IAuthService';
import { IGithubService } from './interfaces/IGithubService';
import { IUserService } from './interfaces/IUserService';

export class AuthService implements IAuthService {
	constructor(
		private githubService: IGithubService,
		private userService: IUserService,
	) {}
	async login(code: string, referer: string) {
		if (!code) {
			throw new BadRequestException('Code is required');
		}

		const access_token = await this.githubService.getAccessTokenByCode(code, referer);

		const userData = await this.userService.getUserAuthenticatedData(access_token);

		const userExists = await this.userService.exists({
			email: userData.email,
			github_user: userData.github_user,
			github_id: userData.github_id,
		});

		if (!userExists) {
			throw new NotFoundException('User not found');
		} else {
			await this.userService.update(userData.github_id, {
				email: userData.email,
				github_user: userData.github_user,
				social_accounts: userData.social_accounts,
			});
			return { access_token };
		}
	}
	async register(code: string, referer: string) {
		console.log('service-register');
		if (!code) {
			throw new BadRequestException('Code is required');
		}

		const access_token = await this.githubService.getAccessTokenByCode(code, referer);

		console.log('service-register-access_token', access_token);

		console.log(access_token);
		const userData = await this.userService.getUserAuthenticatedData(access_token);

		const userExists = await this.userService.exists({
			email: userData.email,
			github_user: userData.github_user,
			github_id: userData.github_id,
		});

		if (userExists) {
			throw new ConflictException('User already exists');
		}

		const newUserData = {
			email: userData.email,
			github_id: userData.github_id,
			github_user: userData.github_user,
			social_accounts: userData.social_accounts,
		};

		await this.userService.create(newUserData);

		return { access_token };
	}
}
