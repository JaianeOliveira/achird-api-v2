import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb';
import { IMongoService } from './interfaces/IMongoService';

export class MongoService implements IMongoService {
	private client: MongoClient;

	constructor(database_uri: string, options?: MongoClientOptions) {
		this.client = new MongoClient(database_uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
			...options,
		});
	}

	async connect() {
		await this.client.connect();
		await this.client.db('achird-api-v2').command({ ping: 1 });

		console.log('[MongoDB] Pinged your deployment. You successfully connected to MongoDB!');
	}

	async close() {
		await this.client.close();
		console.log('[MongoDB] You successfully disconnected to MongoDB!');
	}

	getClient() {
		return this.client;
	}
}
