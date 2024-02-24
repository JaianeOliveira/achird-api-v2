export type SocialAccount = {
	provider: string;
	url: string;
};

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

export type PublicProfileData = {
	name: string;
	email: string;
	avatar_url: string;
	github_user: string;
	github_profile_url: string;
	bio: string;
	social_accounts: SocialAccount[];
	repositories: any[];
	profissional_experience: any[];
};
export interface IUserService {
	getUserAuthenticatedData(bearer_token: string): Promise<any>;
	exists(queries: FindUserQueries): Promise<boolean>;
	update(github_id: number, data: UpdateUserDTO): Promise<void>;
	create(data: CreateUserDTO): Promise<void>;
	delete(github_id: number): Promise<void>;
	getPublicProfile(github_user: string): Promise<PublicProfileData>;
	list(): Promise<any>;
}
