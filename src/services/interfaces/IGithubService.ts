export interface IGithubService {
	getAccessTokenByCode(code: string, redirect_uri: string): Promise<string>;
	getAuthenticatedUser(token: string): Promise<any>;
	getUser(github_user: string): Promise<any>;
	getRepositories(access_token: string): Promise<any>;
}

export type Repository = {
	name: string;
	url: string;
	readme: string;
	topics: string[];
	license: {
		key: string;
		name: string;
		url: string;
	};
	description: string;
	homepage: string;
};
