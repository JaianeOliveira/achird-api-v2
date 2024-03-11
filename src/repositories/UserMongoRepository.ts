import { PageConfig, User } from '@/entities/User';
import { IMongoService } from '@/services/interfaces/IMongoService';
import { FindUserQueries } from '@/services/interfaces/IUserService';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserMongoRepository implements IUserRepository {
	private db: any;
	private collection: any;
	constructor(private mongoService: IMongoService) {
		this.db = this.mongoService.getClient().db('achird-api');
		this.collection = this.db.collection('users');
	}
	async update(github_id: number, data: Partial<Omit<User, '_id'>>): Promise<void> {
		await this.collection.findOneAndUpdate(
			{ github_id: github_id },
			{
				$set: {
					...data,
				},
			},
			{ returnOriginal: false },
		);
	}
	async create(data: Omit<User, '_id'>): Promise<void> {
		await this.collection.insertOne({
			...data,
		});
	}
	async delete(github_id: number): Promise<void> {
		await this.collection.deleteOne({ github_id });
	}

	async exists(queries: FindUserQueries): Promise<boolean> {
		return !!(await this.collection
			.find({
				$or: [
					{ email: queries.email },
					{ github_user: queries.github_user },
					{ github_id: queries.github_id },
				],
			})
			.count());
	}
	async find(queries: FindUserQueries & { id?: string; slug?: string }): Promise<User> {
		return await this.collection.findOne({
			$or: [
				{ id: queries.id },
				{ 'page_config.slug': queries.slug },
				{ email: queries.email },
				{ github_user: queries.github_user },
				{ github_id: queries.github_id },
			],
		});
	}

	async findByGithubUser(github_user: string): Promise<User> {
		return await this.collection.findOne({ github_user });
	}

	async findByGithubId(github_id: number): Promise<User> {
		return await this.collection.findOne({ github_id });
	}

	async findBySlug(slug: string): Promise<User> {
		return await this.collection.findOne({ 'page_config.slug': slug });
	}

	async list(): Promise<User[]> {
		const users = await this.collection.find().toArray();

		return users;
	}

	async updatePageConfig(github_id: number, data: Partial<PageConfig>): Promise<void> {
		await this.collection.updateOne(
			{ github_id },
			{
				$set: {
					page_config: {
						...data,
					},
				},
			},
		);
	}
}
