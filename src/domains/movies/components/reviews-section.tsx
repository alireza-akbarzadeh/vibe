import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { reviews } from "../data";
import { Review } from "./review";

export function ReviewsSection() {
	const [filter, setFilter] = useState("all");
	const [expandedReviews, setExpandedReviews] = useState(new Set());

	const toggleExpanded = (id: number) => {
		const newExpanded = new Set(expandedReviews);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedReviews(newExpanded);
	};

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
								{reviews.length.toLocaleString()} reviews
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
						{reviews.map((review, index) => (
							<Review
								expandedReviews={expandedReviews}
								toggleExpanded={toggleExpanded}
								review={review}
								index={index}
								key={review.id}
							/>
						))}
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
