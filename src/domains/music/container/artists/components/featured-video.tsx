import { Eye, Play } from "lucide-react";
import { useState } from "react";
import { motion } from "@/components/motion";

export function FeaturedVideo({ video }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8">
				<h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
					Featured
				</h2>
				<p className="text-gray-400">Latest music video</p>
			</div>

			<motion.div
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
			>
				{/* Video thumbnail */}
				<div className="relative aspect-video">
					<motion.div
						animate={{ scale: isHovered ? 1.05 : 1 }}
						transition={{ duration: 0.6 }}
						className="w-full h-full"
					>
						<img
							src={video.thumbnail}
							alt={video.title}
							className="w-full h-full object-cover"
						/>
					</motion.div>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

					{/* Play button */}
					<motion.div
						initial={{ scale: 1 }}
						animate={{ scale: isHovered ? 1.1 : 1 }}
						transition={{ duration: 0.3 }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 backdrop-blur-sm"
						>
							<Play className="w-10 h-10 text-white fill-white ml-1" />
						</motion.button>
					</motion.div>

					{/* Duration badge */}
					<div className="absolute top-6 right-6 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white font-medium">
						{video.duration}
					</div>

					{/* Video info */}
					<div className="absolute bottom-0 left-0 right-0 p-8">
						<h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
							{video.title}
						</h3>
						<div className="flex items-center gap-2 text-gray-300">
							<Eye className="w-5 h-5" />
							<span className="text-lg font-semibold">{video.views} views</span>
						</div>
					</div>

					{/* Animated gradient border on hover */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: isHovered ? 1 : 0 }}
						className="absolute inset-0 rounded-3xl"
						style={{
							boxShadow:
								"0 0 60px rgba(139, 92, 246, 0.6), inset 0 0 60px rgba(139, 92, 246, 0.1)",
						}}
					/>

					{/* Scanline effect */}
					<motion.div
						animate={{
							y: isHovered ? ["0%", "100%"] : "0%",
						}}
						transition={{
							duration: 2,
							repeat: isHovered ? Infinity : 0,
							ease: "linear",
						}}
						className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-32 pointer-events-none"
					/>
				</div>

				{/* Glow effect */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: isHovered ? 0.8 : 0 }}
					className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl -z-10"
				/>
			</motion.div>
		</motion.section>
	);
}
