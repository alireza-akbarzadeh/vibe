import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import { AddButton } from "@/components/buttons/add-button";
import { LikeButton } from "@/components/buttons/like-button";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Typography } from "@/components/ui/typography";
import { generateSlug } from "@/lib/utils";
import { recommendations } from './data';


const moods = [
	{ id: "energetic", label: "Energetic", color: "from-orange-500 to-red-500" },
	{ id: "chill", label: "Chill", color: "from-cyan-500 to-teal-500" },
	{ id: "romantic", label: "Romantic", color: "from-pink-500 to-rose-500" },
	{ id: "dark", label: "Dark & Moody", color: "from-purple-600 to-indigo-600" },
];

export type MoodKey = "energetic" | "chill" | "romantic" | "dark";



export default function RecommendationsShowcase() {
	const [activeMood, setActiveMood] = useState<MoodKey>("dark");
	const navigate = useNavigate()
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
					<Typography.H2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						Discover Your{" "}
						<span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
							Mood
						</span>
					</Typography.H2>
					<Typography.P className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
						Tell us how you feel, and we'll curate the perfect mix
					</Typography.P>

					{/* Mood selector */}
					<div className="flex flex-wrap justify-center gap-3 mb-16">
						{moods.map((mood) => (
							<Button
								size="lg"
								variant="text"
								key={mood.id}
								onClick={() => setActiveMood(mood.id as MoodKey)}
								className={`relative p-6 rounded-full font-medium transition-all duration-300 ${activeMood === mood.id
									? "text-white"
									: "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
									}`}
							>
								{activeMood === mood.id && (
									<motion.div
										layoutId="moodBg"
										className={`absolute inset-0 rounded-full bg-linear-to-r ${mood.color}`}
										transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
									/>
								)}
								<span className="relative z-10">{mood.label}</span>
							</Button>
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
									<Image
										src={item.image}
										alt={item.title}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>

									{/* Overlay */}
									<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

									{/* Type badge */}
									<div className="absolute top-3 left-3">
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${item.type === "music"
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
											<LikeButton iconSize="large" className="p-3 size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all hover:scale-110" />
											<Button
												onClick={() => navigate({ to: "/movies/$movieId", params: { movieId: generateSlug(item.title) } })}
												type="button"
												size="lg"
												variant="text"
												className="p-4 size-15 rounded-full bg-white text-black hover:scale-110 transition-transform"
											>
												<Play className="size-6 fill-current ml-0.5" />
											</Button>
											<AddButton
												iconSize="small"
												className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all hover:scale-110 size-12"

											/>
										</div>
									</div>

									{/* Content */}
									<div className="absolute bottom-0 left-0 right-0 p-4">
										<Typography.H3 className="text-white font-bold text-lg truncate">
											{item.title}
										</Typography.H3>
										<Typography.P className="text-gray-300 text-sm">{item.artist}</Typography.P>
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
