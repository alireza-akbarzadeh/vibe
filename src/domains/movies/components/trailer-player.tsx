import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import { PlayButton } from "@/components/play-button";
import { Button } from "@/components/ui/button";

interface TrailerPlayerProps {
	trailerUrl: string;
}

export function TrailerPlayer({ trailerUrl }: TrailerPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false);

	return (
		<section className="relative py-20 bg-linear-to-b from-[#0a0a0a] to-[#0d0d0d]">
			<div className="max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
						Watch Trailer
					</h2>

					<div className="relative aspect-video rounded-3xl overflow-hidden group">
						{!isPlaying ? (
							<>
								<img
									src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&h=720&fit=crop"
									alt="Trailer thumbnail"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
								<PlayButton size="medium" value={isPlaying} onOpenChange={setIsPlaying} />
							</>
						) : (
							<iframe
								src={`${trailerUrl}?autoplay=1`}
								title="Movie Trailer"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="w-full h-full"
							/>
						)}

						{/* Border glow */}
						<div
							className="absolute inset-0 rounded-3xl border-2 border-transparent bg-linear-to-r from-purple-600 via-pink-600 to-cyan-600 opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none"
							style={{
								WebkitMask:
									"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
								WebkitMaskComposite: "xor",
								maskComposite: "exclude",
								padding: "2px",
							}}
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
