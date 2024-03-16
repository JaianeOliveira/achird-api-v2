import { BadRequestException } from '@/utils/Exceptions';
import { IAuthService } from './interfaces/IAuthService';
import { IGithubService } from './interfaces/IGithubService';
import { IJwtService } from './interfaces/IJWTService';
import { CreateUserDTO, IUserService } from './interfaces/IUserService';

export class AuthService implements IAuthService {
	constructor(
		private githubService: IGithubService,
		private userService: IUserService,
		private jwtService: IJwtService,
	) {}

	async authenticate(code: string, referer: string) {
		if (!code) {
			throw new BadRequestException(
				'Código não encontrado',
				'Code is required',
				'AuthService@login',
			);
		}

		try {
			const github_access_token = await this.githubService.getAccessTokenByCode(code, referer);
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

			const user_data: CreateUserDTO = {
				...github_util_data,
				professional_experience: [],
			};

			const user_exists = await this.userService.exists({
				email: user_data.email,
				github_user: user_data.github_user,
				github_id: user_data.github_id,
			});

			if (!user_exists) {
				await this.userService.create(user_data);
			} else {
				await this.userService.update(user_data.github_id, github_util_data);
			}

			const jwt_token = this.jwtService.sign({
				github_access_token,
				github_user: user_data.github_user,
				github_id: user_data.github_id,
			});

			return {
				jwt_token,
				user: {
					github_id: user_data.github_id,
					github_user: user_data.github_user,
					email: user_data.email,
					name: user_data.name,
				},
			};
		} catch (error) {
			console.log(error);
			throw new BadRequestException(
				'Ops! Parece que estamos com problemas internos. Estamos trabalhando para resolver isto. Tente mais tarde novamente',
				'Error on Github API',
				'AuthService@autenticate',
			);
		}
	}
}
