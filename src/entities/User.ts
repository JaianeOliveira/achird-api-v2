export type SocialAccount = {
	provider: string;
	url: string;
};

export type Repository = {
	id: number;
	name: string;
	url: string;
	readme_url: string;
	description: string;
	language?: string;
	topics: string[];
	license?: {
		key: string;
		name: string;
		url: string;
	};
	homepage?: string;
};

export type PageConfig = {
	slug: string;
	page_is_public: boolean;
	theme: string;
};

export type User = {
	_id: string;
	name: string;
	bio?: string;
	avatar_url?: string;
	email: string;
	github_user: string;
	github_id: number;
	page_config: PageConfig;
	social_accounts: SocialAccount[];
	repositories: Repository[];
	professional_experience: any[];
	created_at: string;
	updated_at: string;
};
