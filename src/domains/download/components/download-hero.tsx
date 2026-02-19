import { Download, Shield, Users, Zap } from "lucide-react";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";

export function DownloadHero() {
	const features = [
		{ icon: Shield, label: "Secure & Verified" },
		{ icon: Zap, label: "Lightning Fast" },
		{ icon: Users, label: "10M+ Downloads" },
	];

	return (
		<div className="relative min-h-[70vh] flex items-center justify-center px-6 py-20">
			{/* Content */}
			<div className="max-w-4xl mx-auto text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-6"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-600/30 mb-6">
						<div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
						<span className="text-sm font-medium text-purple-400">
							Latest Version: 2.5.0
						</span>
					</div>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
					style={{
						textShadow: "0 0 60px rgba(139, 92, 246, 0.3)",
					}}
				>
					Download Vibe
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto"
				>
					Your ultimate entertainment platform. Stream music, movies, and more
					on any device, anywhere.
				</motion.p>

				{/* Features */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="flex flex-wrap items-center justify-center gap-6 mb-12"
				>
					{features.map((feature, index) => (
						<motion.div
							key={feature.label}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4 + index * 0.1 }}
							className="flex items-center gap-2 text-gray-300"
						>
							<div className="p-2 rounded-lg bg-white/5">
								<feature.icon className="w-5 h-5 text-purple-400" />
							</div>
							<span className="text-sm font-medium">{feature.label}</span>
						</motion.div>
					))}
				</motion.div>

				{/* CTA Button */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
				>
					<Button
						size="lg"
						className="h-14 px-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full font-bold text-lg shadow-2xl shadow-purple-500/40 group"
					>
						<Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
						Download Now
					</Button>
					<p className="text-sm text-gray-500 mt-4">
						Free download · No credit card required
					</p>
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity }}
					className="mt-16 flex flex-col items-center gap-2 text-white/60"
				>
					<span className="text-xs">Scroll to see platforms</span>
					<div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
						<motion.div
							animate={{ y: [0, 10, 0] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="w-1 h-2 bg-white/60 rounded-full"
						/>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
