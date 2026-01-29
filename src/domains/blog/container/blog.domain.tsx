import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { Search, XCircle } from "lucide-react";
import { MOCK_ARTICLES } from "../blog-mock";
import { ArticleCard } from "../components/article-card";
import { actions, blogStore } from "../store/blog.store";

export default function Blog() {
	const activeCategory = useStore(blogStore, (s) => s.activeCategory);
	const searchQuery = useStore(blogStore, (s) => s.searchQuery);

	// Filter Logic: Category + Search
	const bookmarks = useStore(blogStore, (s) => s.bookmarks);
	const likes = useStore(blogStore, (s) => s.likes);

	const filteredArticles = MOCK_ARTICLES.filter((article) => {
		// 1. Handle Library Filters
		if (activeCategory === "bookmarks") return bookmarks.includes(article.id);
		if (activeCategory === "likes") return likes.includes(article.id);

		// 2. Handle Editorial Filters + Search
		const matchesCategory =
			activeCategory === "all" || article.category === activeCategory;
		const matchesSearch =
			article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesCategory && matchesSearch;
	});

	return (
		<div className="space-y-12 pb-20">
			{/* Search Section */}
			<header className="px-8 pt-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black tracking-tight text-white">
						{searchQuery ? `Results for "${searchQuery}"` : "Editorial"}
					</h1>
				</div>

				<div className="relative group">
					<Search
						className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? "text-purple-400" : "text-gray-500"}`}
						size={18}
					/>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => actions.setSearchQuery(e.target.value)}
						placeholder="Search articles..."
						className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 w-full md:w-80 outline-none focus:border-purple-500/50 transition-all"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => actions.setSearchQuery("")}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
						>
							<XCircle size={16} />
						</button>
					)}
				</div>
			</header>

			{/* Articles Grid */}
			<section className="px-8">
				<AnimatePresence mode="popLayout">
					{filteredArticles.length > 0 ? (
						<motion.div
							layout
							// The key ensures the animation re-runs when the result set changes
							key={`${activeCategory}-${searchQuery}`}
							initial="hidden"
							animate="show"
							variants={{
								hidden: { opacity: 0 },
								show: {
									opacity: 1,
									transition: {
										staggerChildren: 0.08, // This creates the staggered "wave" effect
									},
								},
							}}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
						>
							{filteredArticles.map((article, index) => (
								<ArticleCard index={index} key={article.id} article={article} />
							))}
						</motion.div>
					) : (
						<motion.div
							key="empty-state"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="py-20 flex flex-col items-center justify-center text-center"
						>
							{/* ... your empty state content ... */}
						</motion.div>
					)}
				</AnimatePresence>
			</section>
		</div>
	);
}
