import { PageConfig, User } from '@/entities/User';
import { FindUserQueries } from '@/services/interfaces/IUserService';

export interface IUserRepository {
	update(
		github_id: number,
		data: Partial<Omit<User, '_id' | 'page_config' | 'created_at'> & Partial<PageConfig>>,
	): Promise<void>;
	create(data: Omit<User, '_id'>): Promise<void>;
	delete(github_id: number): Promise<void>;
	exists(queries: FindUserQueries): Promise<boolean>;
	find(queries: FindUserQueries & { id?: string; slug?: string }): Promise<User>;
	list(): Promise<User[]>;
}
