import { Exception } from '@/utils/Exceptions';
import { queryStringToObject } from '@/utils/QueryString';
import { AxiosInstance } from 'axios';
import { IGithubService, Repository } from './interfaces/IGithubService';

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
			'User-Agent': 'achird-api-v2',
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
		const promises = [
			this.axios.get('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${token}`,
					'User-Agent': 'achird-api-v2',
				},
			}),
			this.axios.get('https://api.github.com/user/social_accounts', {
				headers: {
					Authorization: `Bearer ${token}`,
					'User-Agent': 'achird-api-v2',
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
		const { data } = await this.axios.get(`https://api.github.com/users/${github_user}`, {
			headers: {
				'User-Agent': 'achird-api-v2',
			},
		});

		return data;
	}

	async getRepositories(github_user: string): Promise<Repository[]> {
		const { data } = await this.axios.get(`https://api.github.com/users/${github_user}/repos`, {
			headers: {
				'User-Agent': 'achird-api-v2',
			},
		});

		const filteredRepos = data.filter(
			(repo: any) => repo.topics.includes('frontend') || repo.topics.includes('view-on-achird'),
		);

		return filteredRepos.map((repo: any) => ({
			name: repo.name,
			url: repo.html_url,
			readme: `${repo.url}/readme`,
			topics: repo.topics,
			language: repo.language,
			license: {
				key: repo.license?.key,
				name: repo.license?.name,
				url: repo.license?.url,
			},
			description: repo.description,
			homepage: repo.homepage,
		}));
	}
}
