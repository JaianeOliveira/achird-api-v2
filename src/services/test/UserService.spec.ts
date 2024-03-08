import { UserMemoryRepository } from '@/repositories/UserMemoryRepository';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { UserService } from '../UserService';
import { IGithubService } from '../interfaces/IGithubService';
import { IJwtService } from '../interfaces/IJWTService';
import { CreateUserDTO } from '../interfaces/IUserService';
import { FakeGithubService } from './FakeGithubService';
import { FakeJwtService } from './FakeJwtservice';

describe('When trying create a new user', () => {
	let userService: UserService;
	let userRepository: IUserRepository & { clearAll: () => Promise<void> };
	let githubService: IGithubService;
	let jwtService: IJwtService;

	beforeAll(() => {
		githubService = new FakeGithubService();
		userRepository = new UserMemoryRepository();
		jwtService = new FakeJwtService();
		userService = new UserService(userRepository, githubService, jwtService);
	});

	afterEach(async () => {
		await userRepository.clearAll();
	});

	it('Should create a new user', async () => {
		const data: CreateUserDTO = {
			name: 'John Doe',
			avatar_url: 'https://github.com/johndoe.png',
			bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			email: 'johndoe@me.com',
			github_id: 123456,
			github_user: 'johndoe',
			professional_experience: [],
			repositories: [],
			social_accounts: [],
		};

		await userService.create(data);

		const exists = await userRepository.exists({
			github_user: data.github_user,
		});

		expect(exists).toBeTruthy();
	});
});

describe('When trying to update a user', () => {
	let userService: UserService;
	let userRepository: IUserRepository & { clearAll: () => Promise<void> };
	let githubService: IGithubService;
	let jwtService: IJwtService;

	beforeAll(() => {
		githubService = new FakeGithubService();
		userRepository = new UserMemoryRepository();
		jwtService = new FakeJwtService();
		userService = new UserService(userRepository, githubService, jwtService);
	});

	afterEach(async () => {
		await userRepository.clearAll();
	});

	it('Should update a user', async () => {
		const data: CreateUserDTO = {
			name: 'John Doe',
			avatar_url: 'https://github.com/johndoe.png',
			bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			email: 'johndoe@me.com',
			github_id: 123456,
			github_user: 'johndoe',
			professional_experience: [],
			repositories: [],
			social_accounts: [],
		};

		await userService.create(data);

		await userService.update(data.github_id, {
			name: 'Jane Doe',
		});

		const user = await userRepository.find({ github_id: data.github_id });

		expect(user.name).toEqual('Jane Doe');
	});
});
