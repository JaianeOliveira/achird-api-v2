import { User } from '@/entities/User';
import { FindUserQueries } from '@/services/interfaces/IUserService';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserMemoryRepository implements IUserRepository {
	private users: User[] = [];

	async create(data: Omit<User, '_id'>) {
		this.users.push({
			_id: new Date().toISOString(),
			...data,
		});
	}
	async update(github_id: number, data: Partial<Omit<User, '_id'>>): Promise<void> {
		const userIndex = this.users.findIndex((u) => u.github_id === github_id);

		this.users[userIndex] = {
			...this.users[userIndex],
			...data,
			updated_at: new Date().toISOString(),
		};
	}

	async delete(github_id: number): Promise<void> {
		const userIndex = this.users.findIndex((u) => u.github_id === github_id);

		this.users.splice(userIndex, 1);
	}

	async exists(queries: FindUserQueries): Promise<boolean> {
		return !!(await this.find(queries));
	}

	async find(queries: FindUserQueries & { id?: string; slug?: string }): Promise<User> {
		return this.users.find((user) => {
			return (
				user.email === queries.email ||
				user.github_user === queries.github_user ||
				user.github_id === queries.github_id ||
				user._id === queries.id ||
				user.page_config.slug === queries.slug
			);
		})!;
	}

	async list(): Promise<User[]> {
		return this.users;
	}

	async clearAll(): Promise<void> {
		this.users = [];
	}
}
