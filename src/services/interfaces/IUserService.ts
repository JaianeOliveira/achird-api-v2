export type FindUserQueries = {
	email?: string;
	github_user?: string;
	github_id?: number;
};

export type UpdateUserDTO = {
	email?: string;
	github_user?: string;
	social_accounts?: { provider: string; url: string }[];
};
export type CreateUserDTO = {
	email: string;
	github_id: number;
	github_user: string;
	social_accounts?: { provider: string; url: string }[];
};
export interface IUserService {
	getUserAuthenticatedData(token: string): Promise<any>;
	exists(queries: FindUserQueries): Promise<boolean>;
	update(github_id: number, data: UpdateUserDTO): Promise<void>;
	create(data: CreateUserDTO): Promise<void>;
	delete(github_id: number): Promise<void>;
	getUser(github_user: string): Promise<any>;
	list(): Promise<any>;
}
