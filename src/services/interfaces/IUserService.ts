import { SocialAccount, User } from '@/entities/User';

export type FindUserQueries = {
	email?: string;
	github_user?: string;
	github_id?: number;
};

export type UpdateUserDTO = Partial<Omit<CreateUserDTO, 'github_id'>> & {
	professional_experience?: any[];
	page_is_public?: boolean;
	theme?: string;
	slug?: string;
};
export type CreateUserDTO = Pick<
	User,
	| 'name'
	| 'email'
	| 'bio'
	| 'avatar_url'
	| 'github_id'
	| 'github_user'
	| 'social_accounts'
	| 'repositories'
> & {
	professional_experience: any[];
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
