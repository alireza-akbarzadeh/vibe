import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Review } from "./review";

interface ReviewsSectionProps {
	reviews?: {
		items: Array<{
			id: string;
			userId: string;
			mediaId: string;
			rating: number;
			title: string | null;
			content: string;
			helpful: number;
			createdAt: Date;
			updatedAt: Date;
			user: {
				id: string;
				name: string | null;
				image: string | null;
			};
		}>;
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	};
	mediaId: string;
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
	const [filter, setFilter] = useState("all");
	const [expandedReviews, setExpandedReviews] = useState(new Set());

	const toggleExpanded = (id: string) => {
		const newExpanded = new Set(expandedReviews);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedReviews(newExpanded);
	};

	const reviewItems = reviews?.items || [];
	const totalReviews = reviews?.pagination.total || 0;

	// Show placeholder if no reviews
	if (reviewItems.length === 0) {
		return (
			<section className="relative py-20 bg-[#0a0a0a]">
				<div className="max-w-7xl mx-auto px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Reviews
					</h2>
					<p className="text-gray-400">
						No reviews yet. Be the first to review!
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className="relative py-20 bg-[#0a0a0a]">
			<div className="max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="space-y-8"
				>
					{/* Header */}
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
								Reviews
							</h2>
							<p className="text-gray-400">
								{totalReviews.toLocaleString()} reviews
							</p>
						</div>

						{/* Filters */}
						<div className="flex gap-3">
							<Button
								variant={filter === "all" ? "default" : "outline"}
								onClick={() => setFilter("all")}
								className={
									filter === "all"
										? "bg-linear-to-r from-purple-600 to-pink-600"
										: "bg-white/5 border-white/10 text-white hover:bg-white/10"
								}
							>
								All
							</Button>
							<Button
								variant={filter === "positive" ? "default" : "outline"}
								onClick={() => setFilter("positive")}
								className={
									filter === "positive"
										? "bg-linear-to-r from-purple-600 to-pink-600"
										: "bg-white/5 border-white/10 text-white hover:bg-white/10"
								}
							>
								Positive
							</Button>
							<Button
								variant={filter === "critical" ? "default" : "outline"}
								onClick={() => setFilter("critical")}
								className={
									filter === "critical"
										? "bg-linear-to-r from-purple-600 to-pink-600"
										: "bg-white/5 border-white/10 text-white hover:bg-white/10"
								}
							>
								Critical
							</Button>
						</div>
					</div>

					{/* Reviews List */}
					<div className="space-y-6">
						{reviewItems.map((review, index) => {
							// Transform API data to component format
							const transformedReview = {
								id: review.id,
								username: review.user.name || "Anonymous",
								avatar:
									review.user.image ||
									"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
								rating: review.rating,
								title: review.title || "Review",
								content: review.content,
								date: new Date(review.createdAt).toLocaleDateString(),
								helpful: review.helpful,
								verified: true, // TODO: Add verified status to backend
							};

							return (
								<Review
									expandedReviews={expandedReviews}
									toggleExpanded={toggleExpanded}
									review={transformedReview}
									index={index}
									key={review.id}
								/>
							);
						})}
					</div>
					{/* Load More */}
					<div className="flex justify-center pt-4">
						<Button
							variant="outline"
							className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50"
						>
							Load More Reviews
							<ChevronDown className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
