import { AxiosInstance } from 'axios';
import { IGithubService } from './interfaces/IGithubService';
import { queryStringToObject } from '@/utils/QueryString';
import { Exception } from '@/utils/Exceptions';

export class GithubService implements IGithubService {
	private GITHUB_ACCESS_TOKEN_URL: string;

	constructor(private axios: AxiosInstance) {
		this.GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
	}

	async getAccessTokenByCode(code: string, redirect_uri: string): Promise<string> {
		const body = {
			client_id: process.env.GITHUB_CLIENT_ID,
			client_secret: process.env.GITHUB_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: redirect_uri,
		};

		const headers = {
			'Content-Type': 'application/json',
		};

		const { data } = await this.axios.post(this.GITHUB_ACCESS_TOKEN_URL, body, {
			headers,
		});

		const parsedData = queryStringToObject(data) as {
			access_token: string;
			scope: string;
			token_type: string;
		};

		if (!parsedData.access_token) {
			throw new Exception(500, 'Failed to get access token');
		}

		return parsedData.access_token;
	}

	async getAuthenticatedUser(token: string) {
		console.log(token);
		const promises = [
			this.axios.get('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
			this.axios.get('https://api.github.com/user/social_accounts', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		];
		const [user, social] = await Promise.all(promises);

		return {
			user: user.data,
			social_accounts: social.data,
		};
	}

	async getUser(github_user: string): Promise<any> {
		const { data } = await this.axios.get(`https://api.github.com/users/${github_user}`);

		return data;
	}
}
