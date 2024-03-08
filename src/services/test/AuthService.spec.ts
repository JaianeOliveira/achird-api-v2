import { UserMemoryRepository } from '@/repositories/UserMemoryRepository';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { BadRequestException } from '@/utils/Exceptions';
import { AuthService } from '../AuthService';
import { UserService } from '../UserService';
import { IGithubService } from '../interfaces/IGithubService';
import { IJwtService } from '../interfaces/IJWTService';
import { IUserService } from '../interfaces/IUserService';
import { FakeGithubService } from './FakeGithubService';
import { FakeJwtService } from './FakeJwtservice';

describe('When trying to authenticate', () => {
	let authService: AuthService;
	let githubService: IGithubService;
	let userService: IUserService;
	let jwtService: IJwtService;
	let userRepository: IUserRepository & { clearAll: () => Promise<void> };

	beforeAll(() => {
		githubService = new FakeGithubService();
		userRepository = new UserMemoryRepository();
		jwtService = new FakeJwtService();
		userService = new UserService(userRepository, githubService, jwtService);
		authService = new AuthService(githubService, userService, jwtService);
	});

	afterEach(async () => {
		userRepository.clearAll();
	});

	it('Should create a new user if it does not exists', async () => {
		const data = {
			code: 'code',
			referer: 'referer',
		};

		const response = await authService.authenticate(data.code, data.referer);
		const user_exists = await userRepository.exists({ github_user: response.user.github_user });

		expect(user_exists).toBeTruthy();
	});

	it('Should return a jwt token', async () => {
		const data = {
			code: 'code',
			referer: 'referer',
		};

		const response = await authService.authenticate(data.code, data.referer);
		expect(response.jwt_token).toBeTruthy();
	});

	it('Should to throw an error if code is not provided', async () => {
		const data = {
			code: '',
			referer: 'referer',
		};

		await expect(authService.authenticate(data.code, data.referer)).rejects.toThrow(
			BadRequestException,
		);
	});
});
