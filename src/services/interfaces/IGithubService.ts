export interface IGithubService {
	getAccessTokenByCode(code: string, redirect_uri: string): Promise<string>;
	getAuthenticatedUser(token: string): Promise<any>;
	getUser(github_user: string): Promise<any>;
}
