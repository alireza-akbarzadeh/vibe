import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { MOCK_ARTICLES, type Rating } from "../blog-mock";

interface RelatedArticleProps {
	articleId?: number;
}

const RATING_CONFIG: Record<
	Rating,
	{ emoji: string; color: string; bg: string }
> = {
	"Mind Blown": {
		emoji: "🤯",
		color: "text-yellow-400",
		bg: "bg-yellow-400/10 border-yellow-400/20",
	},
	Lit: {
		emoji: "🔥",
		color: "text-orange-500",
		bg: "bg-orange-500/10 border-orange-500/20",
	},
	Love: {
		emoji: "❤️",
		color: "text-pink-500",
		bg: "bg-pink-500/10 border-pink-500/20",
	},
	Interesting: {
		emoji: "🧐",
		color: "text-blue-400",
		bg: "bg-blue-400/10 border-blue-400/20",
	},
	Electric: {
		emoji: "⚡",
		color: "text-purple-400",
		bg: "bg-purple-400/10 border-purple-500/20",
	},
};

export function RelatedArticle({ articleId }: RelatedArticleProps) {
	const navigate = useNavigate();

	// Select 3 related articles instead of 2
	const related = MOCK_ARTICLES.filter((a) => a.id !== articleId).slice(0, 3);

	return (
		<footer className="relative bg-[#050505] border-t border-white/5 py-32 px-6 overflow-hidden">
			{/* Subtle Ambient Background Glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

			<div className="max-w-7xl mx-auto relative z-10">
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
					<div>
						<motion.span
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
						>
							Up Next
						</motion.span>
						<h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
							Keep{" "}
							<span className="text-neutral-800 outline-text">Reading</span>
						</h3>
					</div>

					<button
						type="button"
						onClick={() => navigate({ to: "/blog" })}
						className="group flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-white hover:bg-white/10 transition-all duration-500"
					>
						<span className="text-[10px] font-black uppercase tracking-widest">
							Back to Feed
						</span>
						<div className="bg-purple-500 rounded-full p-1 group-hover:rotate-45 transition-transform duration-500">
							<ArrowUpRight size={14} />
						</div>
					</button>
				</div>

				{/* Grid changed to 3 columns on desktop */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
					{related.map((item, index) => {
						const ratingStyle =
							RATING_CONFIG[item.rating as Rating] || RATING_CONFIG.Interesting;

						return (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1, duration: 0.8 }}
								viewport={{ once: true }}
								onClick={() =>
									navigate({
										to: "/blog/$blogslug",
										params: { blogslug: generateSlug(item.title) },
									})
								}
								className="group cursor-pointer relative"
							>
								{/* Card Media Container - Smaller aspect ratio for 3 columns */}
								<div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 mb-6 shadow-2xl bg-neutral-900">
									<motion.img
										src={item.image}
										className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110"
										alt={item.title}
									/>

									{/* Cinematic Overlays */}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />

									{/* Category Badge */}
									<div className="absolute top-4 left-4">
										<div className="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl">
											<span className="text-[9px] font-black text-white uppercase tracking-widest">
												{item.category}
											</span>
										</div>
									</div>

									{/* Hover Reveal: Interaction Icon */}
									<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
										<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-2xl">
											<ArrowUpRight size={20} />
										</div>
									</div>
								</div>

								{/* Content Details */}
								<div className="px-2">
									<div className="flex items-center justify-between mb-3">
										{/* Reaction Badge integrated here */}
										<div
											className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${ratingStyle.bg}`}
										>
											<span className="text-[10px]">{ratingStyle.emoji}</span>
											<span
												className={`text-[8px] font-black uppercase tracking-widest ${ratingStyle.color}`}
											>
												{item.rating}
											</span>
										</div>

										<div className="flex items-center gap-3">
											<span className="flex items-center gap-1 text-neutral-500 text-[9px] font-bold uppercase tracking-widest">
												<Clock size={10} /> {item.readTime}M
											</span>
										</div>
									</div>

									<h4 className="text-2xl font-black text-white leading-tight group-hover:text-purple-400 transition-colors duration-500 italic tracking-tighter line-clamp-2">
										{item.title}
									</h4>

									<p className="mt-3 text-neutral-500 text-xs line-clamp-2 italic font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
										"{item.excerpt}"
									</p>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>

			{/* Background Texture/Noise for "Premium" feel */}
			<div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
		</footer>
	);
}
