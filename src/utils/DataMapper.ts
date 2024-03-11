import { PageConfig, User } from '@/entities/User';
import {
	CreateUserDTO,
	PublicProfileData,
	UpdateUserDTO,
} from '@/services/interfaces/IUserService';

export class DataMapper {
	static createUser(data: CreateUserDTO): Omit<User, '_id'> {
		const current_date = new Date().toISOString();

		const mapped_data: Omit<User, '_id'> = {
			name: data.name,
			bio: data.bio,
			email: data.email,
			github_id: data.github_id,
			github_user: data.github_user,
			avatar_url: data.avatar_url,
			page_config: {
				page_is_public: false,
				slug: data.github_user?.toLocaleLowerCase(),
				theme: 'achird-dark',
			},
			repositories: data.repositories,
			social_accounts: data.social_accounts,
			professional_experience: data.professional_experience,
			created_at: current_date,
			updated_at: current_date,
		};

		return mapped_data;
	}

	static updateUser({
		theme,
		page_is_public,
		slug,
		...data
	}: UpdateUserDTO): Partial<
		Omit<User, '_id' | 'created_at' | 'page_config'> & Partial<PageConfig>
	> {
		const current_date = new Date().toISOString();

		const mapped_data = {
			...data,
			...((page_is_public || slug || theme) && {
				page_config: {
					...(page_is_public && { page_is_public }),
					...(slug && { slug: data.github_user?.toLocaleLowerCase() }),
					...(theme && { theme }),
				},
			}),
			updated_at: current_date,
		};

		return mapped_data;
	}

	static pageDataDTO(pageData: User): PublicProfileData {
		const dto: PublicProfileData = {
			name: pageData.name,
			email: pageData.email,
			avatar_url: pageData.avatar_url || '',
			github_user: pageData.github_user,
			bio: pageData.bio || '',
			github_profile_url: `https://github.com/${pageData.github_user}`,
			social_accounts: pageData.social_accounts,
			repositories: pageData.repositories,
			profissional_experience: pageData.professional_experience,
			page_is_public: pageData.page_config.page_is_public,
			theme: pageData.page_config.theme,
			slug: pageData.page_config.slug,
		};

		return dto;
	}
}
