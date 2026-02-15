import { motion } from "framer-motion";
import { Flag, MessageCircle, Star, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Reviews } from "@/types/app";

interface ReviewProps {
	review: Reviews;
	index: number;
	toggleExpanded: (id: string | number) => void;
	expandedReviews: Set<unknown>;
}

export function Review(props: ReviewProps) {
	const { expandedReviews, index, review, toggleExpanded } = props;

	return (
		<motion.div
			key={review.id}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
		>
			<Card className="bg-white/3 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/5 hover:border-white/20 transition-all">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<img
							src={review.avatar}
							alt={review.username}
							className="w-12 h-12 rounded-full border-2 border-purple-500/50"
						/>
						<div>
							<div className="flex items-center gap-2">
								<p className="text-white font-medium">{review.username}</p>
								{review.verified && (
									<Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
										Verified
									</Badge>
								)}
							</div>
							<p className="text-sm text-gray-500">{review.date}</p>
						</div>
					</div>

					{/* Rating */}
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<span className="text-white font-bold">{review.rating}/10</span>
					</div>
				</div>

				{/* Title */}
				<h3 className="text-lg font-semibold text-white mb-3">
					{review.title}
				</h3>

				{/* Content */}
				<p
					className={`text-gray-300 leading-relaxed ${!expandedReviews.has(review.id) ? "line-clamp-3" : ""}`}
				>
					{review.content}
				</p>

				{review.content.length > 150 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => toggleExpanded(review.id)}
						className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 mt-2 px-0"
					>
						{expandedReviews.has(review.id) ? "Show less" : "Read more"}
					</Button>
				)}

				{/* Actions */}
				<div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
					<Button
						variant="text"
						className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
					>
						<ThumbsUp className="w-4 h-4" />
						<span className="text-sm">Helpful ({review.helpful})</span>
					</Button>
					<Button
						variant="text"
						className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
					>
						<MessageCircle className="w-4 h-4" />
						<span className="text-sm">Reply</span>
					</Button>
					<Button
						variant="text"
						className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors ml-auto"
					>
						<Flag className="w-4 h-4" />
						<span className="text-sm">Report</span>
					</Button>
				</div>
			</Card>
		</motion.div>
	);
}
