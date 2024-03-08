import { PageConfig, User } from '@/entities/User';
import { CreateUserDTO, UpdateUserDTO } from '@/services/interfaces/IUserService';

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
				theme: 'default',
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
}
