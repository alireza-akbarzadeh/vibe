import { motion } from "framer-motion";
import { Check, Download, ExternalLink, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export function PlatformCard({ platform, index, isRecommended }) {
	const [isDownloading, setIsDownloading] = useState(false);
	const [isDownloaded, setIsDownloaded] = useState(false);

	const handleDownload = () => {
		setIsDownloading(true);

		// Simulate download
		setTimeout(() => {
			setIsDownloading(false);
			setIsDownloaded(true);

			// Reset after animation
			setTimeout(() => setIsDownloaded(false), 3000);
		}, 2000);
	};

	const Icon = platform.icon;

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			whileHover={{ y: -8 }}
			className="relative group"
		>
			{/* Recommended badge */}
			{isRecommended && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8, y: -10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
				>
					<div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-500/50">
						Recommended for you
					</div>
				</motion.div>
			)}

			{/* Card */}
			<div className="relative h-full p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden transition-all group-hover:border-white/20 group-hover:bg-white/10">
				{/* Gradient background on hover */}
				<motion.div
					initial={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
					className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity`}
				/>

				{/* Content */}
				<div className="relative z-10">
					{/* Platform icon */}
					<motion.div
						whileHover={{ scale: 1.1, rotate: 5 }}
						transition={{ type: "spring", stiffness: 300 }}
						className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${platform.color} mb-6 shadow-lg`}
					>
						<Icon className="w-8 h-8 text-white" />
					</motion.div>

					{/* Platform info */}
					<h3 className="text-2xl font-bold text-white mb-2">
						{platform.name}
					</h3>
					<p className="text-gray-400 text-sm mb-1">{platform.version}</p>
					<p className="text-gray-500 text-xs mb-6">{platform.fileSize}</p>

					{/* Requirements */}
					<div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10">
						<p className="text-xs text-gray-400">{platform.requirements}</p>
					</div>

					{/* Download button */}
					<Button
						onClick={handleDownload}
						disabled={isDownloading}
						className={`w-full h-12 rounded-xl font-semibold transition-all ${
							isDownloaded
								? "bg-green-600 hover:bg-green-600 text-white"
								: `bg-gradient-to-r ${platform.color} hover:shadow-lg hover:shadow-purple-500/30 text-white`
						}`}
					>
						{isDownloading ? (
							<>
								<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								Downloading...
							</>
						) : isDownloaded ? (
							<>
								<Check className="w-5 h-5 mr-2" />
								Downloaded!
							</>
						) : (
							<>
								{platform.storeLink ? (
									<>
										<ExternalLink className="w-5 h-5 mr-2" />
										Get from Store
									</>
								) : platform.isWeb ? (
									<>
										<ExternalLink className="w-5 h-5 mr-2" />
										Open Web App
									</>
								) : (
									<>
										<Download className="w-5 h-5 mr-2" />
										Download
									</>
								)}
							</>
						)}
					</Button>
				</div>

				{/* Glow effect on hover */}
				<motion.div
					initial={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
					className="absolute inset-0 rounded-3xl"
					style={{
						boxShadow: "0 0 60px rgba(139, 92, 246, 0.3)",
					}}
				/>
			</div>
		</motion.div>
	);
}
