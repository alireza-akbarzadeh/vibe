export interface Paginated<T> {
	items: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}
