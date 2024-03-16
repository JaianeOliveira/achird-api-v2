import { PageConfig } from '@/entities/User';
import { PublicProfileData } from './IUserService';

export interface IPageService {
	getPageData(slug: string): Promise<PublicProfileData>;
	updatePageConfig(bearer_token: string, data: Partial<PageConfig>): Promise<void>;
	updatePageData(bearer_token: string): Promise<void>;
}
