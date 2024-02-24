import { MongoClient } from 'mongodb';

export interface IMongoService {
	connect(): Promise<void>;
	close(): Promise<void>;
	getClient(): MongoClient;
}
