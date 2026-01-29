import { motion } from "framer-motion";
import {
	BadgeCheck,
	MapPin,
	MoreHorizontal,
	Play,
	Share2,
	UserCheck,
	UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ArtistHero({ artist }) {
	const [isFollowing, setIsFollowing] = useState(false);
	const [showFullBio, setShowFullBio] = useState(false);

	const handleFollow = () => {
		setIsFollowing(!isFollowing);
	};

	return (
		<div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
			{/* Background image with parallax */}
			<motion.div
				initial={{ scale: 1.2, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 1.2, ease: "easeOut" }}
				className="absolute inset-0"
			>
				<div className="absolute inset-0">
					<img
						src={artist.image}
						alt={artist.name}
						className="w-full h-full object-cover"
					/>

					{/* Multi-layer gradients */}
					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
					<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
				</div>
			</motion.div>

			{/* Content */}
			<div className="relative z-10 h-full flex items-end pb-16">
				<div className="max-w-[1800px] mx-auto px-6 w-full">
					<div className="max-w-3xl">
						{/* Verified badge */}
						{artist.verified && (
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
								className="flex items-center gap-2 mb-4"
							>
								<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30">
									<BadgeCheck className="w-4 h-4 text-blue-400" />
									<span className="text-sm font-medium text-blue-400">
										Verified Artist
									</span>
								</div>
							</motion.div>
						)}

						{/* Artist name */}
						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.8 }}
							className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-tight"
							style={{
								textShadow:
									"0 4px 30px rgba(0,0,0,0.8), 0 0 60px rgba(139, 92, 246, 0.4)",
							}}
						>
							{artist.name}
						</motion.h1>

						{/* Stats and metadata */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="flex items-center gap-6 mb-6 flex-wrap"
						>
							<div className="flex items-center gap-2">
								<span className="text-2xl font-bold text-white">
									{artist.followers}
								</span>
								<span className="text-gray-400">followers</span>
							</div>

							<div className="w-1 h-1 rounded-full bg-gray-600" />

							<div className="flex items-center gap-2">
								<span className="text-xl font-semibold text-purple-400">
									{artist.monthlyListeners}
								</span>
								<span className="text-gray-400">monthly listeners</span>
							</div>

							{artist.country && (
								<>
									<div className="w-1 h-1 rounded-full bg-gray-600" />
									<div className="flex items-center gap-2 text-gray-400">
										<MapPin className="w-4 h-4" />
										<span>{artist.country}</span>
									</div>
								</>
							)}
						</motion.div>

						{/* Genres */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.7 }}
							className="flex gap-2 mb-8 flex-wrap"
						>
							{artist.genres.map((genre) => (
								<span
									key={genre}
									className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium"
								>
									{genre}
								</span>
							))}
						</motion.div>

						{/* Bio */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8 }}
							className="mb-8 max-w-2xl"
						>
							<p className="text-gray-300 text-lg leading-relaxed mb-2">
								{showFullBio ? artist.bio.full : artist.bio.short}
							</p>
							{artist.bio.full && artist.bio.full !== artist.bio.short && (
								<button
									type="button"
									onClick={() => setShowFullBio(!showFullBio)}
									className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
								>
									{showFullBio ? "Show less" : "Read more"}
								</button>
							)}
						</motion.div>

						{/* Action buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1 }}
							className="flex items-center gap-4 flex-wrap"
						>
							{/* Play button */}
							<Button className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full font-bold text-lg group shadow-2xl shadow-purple-500/40">
								<Play className="w-5 h-5 mr-2 fill-white group-hover:scale-110 transition-transform" />
								Play
							</Button>

							{/* Follow button with animation */}
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									onClick={handleFollow}
									variant="outline"
									className={`h-14 px-8 rounded-full font-semibold text-lg transition-all ${
										isFollowing
											? "bg-transparent border-2 border-white/30 text-white hover:border-red-500/50 hover:text-red-500"
											: "bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20"
									}`}
								>
									<motion.div
										animate={{
											rotate: isFollowing ? [0, 360] : 0,
										}}
										transition={{ duration: 0.5 }}
									>
										{isFollowing ? (
											<UserCheck className="w-5 h-5 mr-2" />
										) : (
											<UserPlus className="w-5 h-5 mr-2" />
										)}
									</motion.div>
									{isFollowing ? "Following" : "Follow"}
								</Button>
							</motion.div>

							{/* Share button */}
							<Button
								variant="ghost"
								className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white group"
							>
								<Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
							</Button>

							{/* More options */}
							<Button
								variant="ghost"
								className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white group"
							>
								<MoreHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform" />
							</Button>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60"
			>
				<span className="text-xs">Scroll to explore</span>
				<div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
					<motion.div
						animate={{ y: [0, 10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="w-1 h-2 bg-white/60 rounded-full"
					/>
				</div>
			</motion.div>
		</div>
	);
}
