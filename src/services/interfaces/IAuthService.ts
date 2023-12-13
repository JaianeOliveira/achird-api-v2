export type AuthResponse = {
	token: string;
	user: {
		github_id: number;
		github_user: string;
		email: string;
		name: string;
	};
};

export interface IAuthService {
	login(code: string, referer: string): Promise<AuthResponse>;
	register(code: string, referer: string): Promise<AuthResponse>;
}
