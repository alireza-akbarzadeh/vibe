import { Store } from "@tanstack/store";

export interface BlogState {
	activeCategory: string;
	isSidebarOpen: boolean;
	searchQuery: string;
	bookmarks: number[];
}

export const blogStore = new Store<BlogState>({
	activeCategory: "all",
	isSidebarOpen: true,
	searchQuery: "",
	bookmarks: [],
});

export const actions = {
	setActiveCategory: (id: string) =>
		blogStore.setState((s) => ({ ...s, activeCategory: id, searchQuery: "" })),
	setSearchQuery: (query: string) =>
		blogStore.setState((s) => ({ ...s, searchQuery: query })),
	toggleSidebar: () =>
		blogStore.setState((s) => ({ ...s, isSidebarOpen: !s.isSidebarOpen })),

	toggleBookmark: (id: number) => {
		blogStore.setState((s) => {
			const isBookmarked = s.bookmarks.includes(id);
			return {
				...s,
				bookmarks: isBookmarked
					? s.bookmarks.filter((bid) => bid !== id)
					: [...s.bookmarks, id],
			};
		});
	},
};
