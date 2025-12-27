import { AnimatePresence, motion } from "framer-motion";
import { Heart, Play, Plus } from "lucide-react";
import { useState } from "react";

const moods = [
	{ id: "energetic", label: "Energetic", color: "from-orange-500 to-red-500" },
	{ id: "chill", label: "Chill", color: "from-cyan-500 to-teal-500" },
	{ id: "romantic", label: "Romantic", color: "from-pink-500 to-rose-500" },
	{ id: "dark", label: "Dark & Moody", color: "from-purple-600 to-indigo-600" },
];

type MoodKey = "energetic" | "chill" | "romantic" | "dark";

const recommendations: Record<
	MoodKey,
	{ type: string; title: string; artist: string; image: string }[]
> = {
	energetic: [
		{
			type: "music",
			title: "Power Anthems",
			artist: "Various Artists",
			image:
				"https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Mad Max: Fury Road",
			artist: "Action",
			image:
				"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop",
		},
		{
			type: "music",
			title: "Workout Beast Mode",
			artist: "DJ Thunder",
			image:
				"https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Top Gun",
			artist: "Action",
			image:
				"https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?w=400&h=400&fit=crop",
		},
	],
	chill: [
		{
			type: "music",
			title: "Lo-Fi Dreams",
			artist: "Sleepy Beats",
			image:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Lost in Translation",
			artist: "Drama",
			image:
				"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop",
		},
		{
			type: "music",
			title: "Rainy Day Jazz",
			artist: "Mellow Collective",
			image:
				"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Her",
			artist: "Sci-Fi Romance",
			image:
				"https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=400&fit=crop",
		},
	],
	romantic: [
		{
			type: "music",
			title: "Love Songs",
			artist: "Various Artists",
			image:
				"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "The Notebook",
			artist: "Romance",
			image:
				"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop",
		},
		{
			type: "music",
			title: "Midnight Slow Dance",
			artist: "Luna Rose",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "La La Land",
			artist: "Musical",
			image:
				"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
		},
	],
	dark: [
		{
			type: "music",
			title: "Dark Synthwave",
			artist: "Neon Void",
			image:
				"https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Blade Runner 2049",
			artist: "Sci-Fi",
			image:
				"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
		},
		{
			type: "music",
			title: "Industrial Nights",
			artist: "Chrome Shadows",
			image:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "The Matrix",
			artist: "Sci-Fi",
			image:
				"https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=400&fit=crop",
		},
	],
};

export default function RecommendationsShowcase() {
	const [activeMood, setActiveMood] = useState<MoodKey>("dark");

	return (
		<section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
			{/* Background accent */}
			<div className="absolute inset-0">
				<div className="absolute top-1/2 left-0 w-1/2 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2" />
				<div className="absolute top-1/2 right-0 w-1/2 h-96 bg-cyan-600/10 rounded-full blur-3xl -translate-y-1/2" />
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						Discover Your{" "}
						<span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
							Mood
						</span>
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
						Tell us how you feel, and we'll curate the perfect mix
					</p>

					{/* Mood selector */}
					<div className="flex flex-wrap justify-center gap-3 mb-16">
						{moods.map((mood) => (
							<button
								type="submit"
								key={mood.id}
								onClick={() => setActiveMood(mood.id as MoodKey)}
								className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
									activeMood === mood.id
										? "text-white"
										: "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
								}`}
							>
								{activeMood === mood.id && (
									<motion.div
										layoutId="moodBg"
										className={`absolute inset-0 rounded-full bg-linear-to-r ${mood.color}`}
										transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
									/>
								)}
								<span className="relative z-10">{mood.label}</span>
							</button>
						))}
					</div>
				</motion.div>

				{/* Recommendations grid */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeMood}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.4 }}
						className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
					>
						{recommendations[activeMood].map((item, index) => (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1, duration: 0.4 }}
								className="group relative"
							>
								<div className="relative aspect-square rounded-2xl overflow-hidden">
									<img
										src={item.image}
										alt={item.title}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>

									{/* Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

									{/* Type badge */}
									<div className="absolute top-3 left-3">
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
												item.type === "music"
													? "bg-purple-500/30 text-purple-200 border border-purple-400/30"
													: "bg-cyan-500/30 text-cyan-200 border border-cyan-400/30"
											}`}
										>
											{item.type === "music" ? "♪ Music" : "▶ Movie"}
										</span>
									</div>

									{/* Hover actions */}
									<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
										<div className="flex items-center gap-3">
											<button
												type="button"
												className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all hover:scale-110"
											>
												<Heart className="w-5 h-5" />
											</button>
											<button
												type="button"
												className="p-4 rounded-full bg-white text-black hover:scale-110 transition-transform"
											>
												<Play className="w-6 h-6 fill-current ml-0.5" />
											</button>
											<button
												type="button"
												className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all hover:scale-110"
											>
												<Plus className="w-5 h-5" />
											</button>
										</div>
									</div>

									{/* Content */}
									<div className="absolute bottom-0 left-0 right-0 p-4">
										<h3 className="text-white font-bold text-lg truncate">
											{item.title}
										</h3>
										<p className="text-gray-300 text-sm">{item.artist}</p>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</AnimatePresence>
			</div>
		</section>
	);
}
