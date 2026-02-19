import { motion } from "@/components/motion";
import type { MovieTypes } from "@/types/app";

interface MovieDetailsSectionProps {
	movie: MovieTypes;
}

const detailItem = (label: string, value: string | string[]) => (
	<div className="border-b border-white/10 py-4">
		<p className="text-sm text-gray-400 font-medium mb-1">{label}</p>
		<p className="text-lg text-white font-semibold">
			{Array.isArray(value) ? value.join(", ") : value}
		</p>
	</div>
);

export function MovieDetailsSection({ movie }: MovieDetailsSectionProps) {
	return (
		<div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
			>
				<h2 className="text-3xl font-bold text-white mb-6">Details</h2>
				<div className="grid md:grid-cols-2 gap-x-12 gap-y-4 bg-white/5 p-8 rounded-2xl border border-white/10">
					<div>
						{detailItem("Director", movie.director)}
						{detailItem("Writers", movie.writers)}
						{detailItem("Starring", movie.stars)}
					</div>
					<div>
						{detailItem("Production Co.", movie.productionCo)}
						{detailItem("Budget", movie.budget)}
						{detailItem("Box Office Revenue", movie.revenue)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}
