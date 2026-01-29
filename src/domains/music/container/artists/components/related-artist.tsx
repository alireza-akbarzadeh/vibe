import { motion } from "framer-motion";
import { BadgeCheck, UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RelatedArtists({ artists }) {
	const [followedArtists, setFollowedArtists] = useState([]);

	const handleFollow = (artistId) => {
		setFollowedArtists((prev) =>
			prev.includes(artistId)
				? prev.filter((id) => id !== artistId)
				: [...prev, artistId],
		);
	};

	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8">
				<h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
					Fans Also Like
				</h2>
				<p className="text-gray-400">Artists similar to this one</p>
			</div>

			{/* Grid layout */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
				{artists.map((artist, index) => (
					<motion.div
						key={artist.id}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.1, duration: 0.5 }}
						className="group cursor-pointer"
					>
						{/* Artist image */}
						<div className="relative mb-4">
							<motion.div
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
								className="aspect-square rounded-full overflow-hidden shadow-2xl"
							>
								<img
									src={artist.image}
									alt={artist.name}
									className="w-full h-full object-cover"
								/>

								{/* Dark overlay on hover */}
								<motion.div
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									className="absolute inset-0 bg-black/40 backdrop-blur-sm"
								/>
							</motion.div>

							{/* Verified badge */}
							{artist.verified && (
								<div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white shadow-lg">
									<BadgeCheck className="w-4 h-4 text-white" />
								</div>
							)}

							{/* Follow button on hover */}
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								whileHover={{ opacity: 1, y: 0 }}
								className="absolute bottom-4 left-1/2 -translate-x-1/2"
							>
								<Button
									onClick={() => handleFollow(artist.id)}
									size="sm"
									className={`rounded-full font-semibold shadow-xl transition-all ${followedArtists.includes(artist.id)
											? "bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30"
											: "bg-white text-black hover:bg-gray-200"
										}`}
								>
									{followedArtists.includes(artist.id) ? (
										<>
											<UserCheck className="w-4 h-4 mr-1" />
											Following
										</>
									) : (
										<>
											<UserPlus className="w-4 h-4 mr-1" />
											Follow
										</>
									)}
								</Button>
							</motion.div>

							{/* Glow effect */}
							<motion.div
								initial={{ opacity: 0 }}
								whileHover={{ opacity: 1 }}
								className="absolute inset-0 rounded-full"
								style={{
									boxShadow: "0 0 50px rgba(139, 92, 246, 0.4)",
								}}
							/>
						</div>

						{/* Artist info */}
						<div className="text-center">
							<h3 className="text-white font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors truncate">
								{artist.name}
							</h3>
							<p className="text-sm text-gray-400">
								{artist.followers} followers
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</motion.section>
	);
}
