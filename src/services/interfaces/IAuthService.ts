export type AuthResponse = {
	jwt_token: string;
	user: {
		github_id: number;
		github_user: string;
		email: string;
		name: string;
	};
};

export interface IAuthService {
	authenticate(code: string, referer: string): Promise<AuthResponse>;
}
