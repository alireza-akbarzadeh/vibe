import { Store } from "@tanstack/store";

export interface BlogState {
	activeCategory: string;
	isSidebarOpen: boolean;
	searchQuery: string;
	bookmarks: number[];
	likes: number[];
	readingProgress: Record<number, number>;
	finishedArticles: number[];
	reactions: Record<number, string>;
	reactionCounts: Record<number, Record<string, number>>;
}
export const initialReactionCounts: Record<string, number> = {
	"🤯": 12,
	"🔥": 24,
	"💖": 18,
	"👀": 7,
	"⚡️": 15,
};
export const blogStore = new Store<BlogState>({
	activeCategory: "all",
	isSidebarOpen: true,
	searchQuery: "",
	bookmarks: [],
	likes: [],
	readingProgress: { 2: 45, 5: 80 },
	finishedArticles: [4],
	reactions: {},
	reactionCounts: {},
});

export const actions = {
	setReaction: (articleId: number, emoji: string) => {
		blogStore.setState((s) => {
			const currentReaction = s.reactions[articleId];
			const currentCounts =
				s.reactionCounts[articleId] || initialReactionCounts;

			const newCounts = { ...currentCounts };

			if (currentReaction) {
				newCounts[currentReaction] = Math.max(
					0,
					newCounts[currentReaction] - 1,
				);
			}

			if (currentReaction !== emoji) {
				newCounts[emoji] = (newCounts[emoji] || 0) + 1;
			}

			return {
				...s,
				reactions: {
					...s.reactions,
					[articleId]: currentReaction === emoji ? "" : emoji,
				},
				reactionCounts: { ...s.reactionCounts, [articleId]: newCounts },
			};
		});
	},

	setActiveCategory: (id: string) =>
		blogStore.setState((s) => ({ ...s, activeCategory: id, searchQuery: "" })),
	setSearchQuery: (query: string) =>
		blogStore.setState((s) => ({ ...s, searchQuery: query })),
	toggleSidebar: () =>
		blogStore.setState((s) => ({ ...s, isSidebarOpen: !s.isSidebarOpen })),
	clearSearch: () => blogStore.setState((s) => ({ ...s, searchQuery: "" })),
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

	toggleLike: (id: number) => {
		blogStore.setState((s) => ({
			...s,
			likes: s.likes.includes(id)
				? s.likes.filter((i) => i !== id)
				: [...s.likes, id],
		}));
	},

	updateProgress: (id: number, progress: number) => {
		blogStore.setState((s) => {
			const isDone = progress >= 95;
			const newFinished = isDone
				? Array.from(new Set([...s.finishedArticles, id]))
				: s.finishedArticles.filter((fid) => fid !== id);

			return {
				...s,
				readingProgress: {
					...s.readingProgress,
					[id]: isDone ? 100 : progress,
				},
				finishedArticles: newFinished,
			};
		});
	},

	// Manual toggle for convenience
	toggleFinished: (id: number) => {
		blogStore.setState((s) => {
			const isAlreadyFinished = s.finishedArticles.includes(id);
			return {
				...s,
				finishedArticles: isAlreadyFinished
					? s.finishedArticles.filter((fid) => fid !== id)
					: [...s.finishedArticles, id],
				readingProgress: {
					...s.readingProgress,
					[id]: isAlreadyFinished ? 0 : 100,
				},
			};
		});
	},
};
