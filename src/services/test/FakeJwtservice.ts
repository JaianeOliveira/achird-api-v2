import { IJwtService, JWTPayload } from '../interfaces/IJWTService';

export class FakeJwtService implements IJwtService {
	sign(payload: JWTPayload, config?: { expiresIn: string }): string {
		return '234523452';
	}

	verify(token: string): any {
		return {
			github_access_token: '123456',
			github_user: 'johndoe',
			github_id: 123456,
		};
	}
}
