import { BadRequestException, ConflictException, NotFoundException } from '@/utils/Exceptions';
import { IAuthService } from './interfaces/IAuthService';
import { IGithubService } from './interfaces/IGithubService';
import { IUserService } from './interfaces/IUserService';
import { IJwtService } from './interfaces/IJWTService';

export class AuthService implements IAuthService {
	constructor(
		private githubService: IGithubService,
		private userService: IUserService,
		private jwtService: IJwtService,
	) {}

	async login(code: string, referer: string) {
		if (!code) {
			throw new BadRequestException('Código não encontrado', 'Code is required');
		}

		const access_token = await this.githubService.getAccessTokenByCode(code, referer);

		const userData = await this.githubService.getAuthenticatedUser(access_token);
		// const userData = await this.userService.getUserAuthenticatedData(access_token);

		const data = {
			github_id: userData.user.id,
			github_user: userData.user.login,
			email: userData.user.email,
			social_accounts: userData.social_accounts,
		};

		const userExists = await this.userService.exists({
			email: data.email,
			github_user: data.github_user,
			github_id: data.github_id,
		});

		if (!userExists) {
			throw new NotFoundException('Usuário não encontrado', 'User not found');
		} else {
			await this.userService.update(data.github_id, {
				email: data.email,
				github_user: data.github_user,
				social_accounts: data.social_accounts,
			});
			const token = this.jwtService.sign({
				github_access_token: access_token,
				github_user: data.github_user,
				github_id: data.github_id,
			});
			return {
				token,
				user: {
					github_id: data.github_id,
					github_user: data.github_user,
					email: data.email,
					name: userData.user.name,
				},
			};
		}
	}
	async register(code: string, referer: string) {
		if (!code) {
			throw new BadRequestException('Código não encontrado', 'Code is required');
		}

		const access_token = await this.githubService.getAccessTokenByCode(code, referer);

		const userData = await this.githubService.getAuthenticatedUser(access_token);

		const userExists = await this.userService.exists({
			email: userData.user.email,
			github_user: userData.user.login,
			github_id: userData.user.id,
		});

		if (userExists) {
			throw new ConflictException('Este usuário já está registrado', 'User already exists');
		}

		const newUserData = {
			email: userData.user.email,
			github_id: userData.user.id,
			github_user: userData.user.login,
			social_accounts: userData.social_accounts,
		};

		await this.userService.create(newUserData);

		const token = this.jwtService.sign({
			github_access_token: access_token,
			github_user: userData.github_user,
			github_id: userData.github_id,
		});

		return {
			token,
			user: {
				github_id: userData.user.id,
				github_user: userData.user.login,
				email: userData.user.email,
				name: userData.user.name,
			},
		};
	}
}
