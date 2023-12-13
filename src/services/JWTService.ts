import jwt from 'jsonwebtoken';
import { IJwtService, JWTPayload } from './interfaces/IJWTService';
export class JwtService implements IJwtService {
	private secret: string;
	constructor() {
		this.secret = process.env.JWT_SECRET || '';
	}
	sign(payload: JWTPayload, config?: { expiresIn: string }): string {
		return jwt.sign(payload, this.secret, {
			algorithm: 'HS256',
			expiresIn: config?.expiresIn || '4h',
		});
	}
	verify(token: string) {
		return jwt.verify(token, this.secret, {
			ignoreExpiration: false,
		});
	}
}
