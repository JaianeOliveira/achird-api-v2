import { IGithubService } from '../interfaces/IGithubService';

export class FakeGithubService implements IGithubService {
	getAccessTokenByCode(code: string, redirect_uri: string): Promise<string> {
		return new Promise((resolve) => {
			resolve('123456789');
		});
	}

	getAuthenticatedUser(token: string): Promise<any> {
		return new Promise((resolve) => {
			resolve({
				user: {
					name: 'John Doe',
					avatar_url: 'https://github.com/johndoe.png',
					bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
					email: 'johndoe@me.com',
					login: 'johndoe',
					id: 123456,
				},
				social_accounts: [],
			});
		});
	}

	getRepositories(github_user: string): Promise<any> {
		return new Promise((resolve) => {
			resolve([
				{
					id: 1234,
					name: 'achird',
					url: 'https://github.com/johndoe/achird',
					readme_url: 'https://github.com/johndoe/achird/readme',
					description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
					language: 'JavaScript',
					topics: ['frontend', 'view-on-achird'],
					license: {
						key: 'MIT',
						name: 'MIT License',
						url: 'https://github.com/johndoe/achird/blob/master/LICENSE',
					},
					homepage: 'https://github.com/johndoe/achird',
				},
			]);
		});
	}

	getUser(github_user: string): Promise<any> {
		return new Promise((resolve) => {
			resolve({
				name: 'John Doe',
				avatar_url: 'https://github.com/johndoe.png',
				bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				email: 'johndoe@me.com',
				login: 'johndoe',
				id: 123456,
			});
		});
	}
}
