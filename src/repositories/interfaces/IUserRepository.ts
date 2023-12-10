import { FindUserQueries } from '@/services/interfaces/IUserService';

export type IUser = {
	_id: string;
	email: string;
	github_id: number;
	github_user: string;
	slug: string;
	social_accounts: { provider: string; url: string }[];
	created_at: string;
	updated_at: string;
};

export interface IUserRepository {
	update(github_id: number, data: Partial<Omit<IUser, '_id'>>): Promise<void>;
	create(data: Omit<IUser, '_id'>): Promise<void>;
	delete(github_id: number): Promise<void>;
	exists(queries: FindUserQueries): Promise<boolean>;
	find(queries: FindUserQueries & { id?: string; slug?: string }): Promise<IUser>;
	list(): Promise<IUser[]>;
}
