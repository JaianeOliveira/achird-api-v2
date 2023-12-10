export type AuthResponse = {
	access_token: string;
};

export interface IAuthService {
	login(code: string, referer: string): Promise<AuthResponse>;
	register(code: string, referer: string): Promise<AuthResponse>;
}
