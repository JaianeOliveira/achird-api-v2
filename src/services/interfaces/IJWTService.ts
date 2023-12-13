export type JWTPayload = {
	github_access_token: string;
	github_user: string;
	github_id: number;
};

export interface IJwtService {
	sign(payload: JWTPayload, config?: { expiresIn: string }): string;
	verify(token: string): any;
}
