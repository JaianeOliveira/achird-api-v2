import { User } from '@/entities/User';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { DataMapper } from '@/utils/DataMapper';
import { NotFoundException, UnauthorizedException } from '@/utils/Exceptions';
import { IGithubService } from './interfaces/IGithubService';
import { IJwtService } from './interfaces/IJWTService';
import {
	CreateUserDTO,
	FindUserQueries,
	IUserService,
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

	async list() {
		const users = await this.userRepository.list();
		return users.map((user: User) => ({
			name: user.name,
			github_id: user.github_id,
			github_user: user.github_user,
			avatar_url: user.avatar_url,
			slug: user.page_config.slug,
		}));
	}
}
