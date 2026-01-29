import { motion } from "framer-motion";
import { Apple, Globe, Info, Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { DownloadHero } from "./components/download-hero";
import { PlatformCard } from "./components/platform";

export function DownloadPage() {
	const [detectedPlatform, setDetectedPlatform] = useState(null);

	// Detect user's platform
	useEffect(() => {
		const userAgent = navigator.userAgent.toLowerCase();
		const platform = navigator.platform.toLowerCase();

		if (userAgent.includes("win")) {
			setDetectedPlatform("windows");
		} else if (userAgent.includes("mac") || platform.includes("mac")) {
			setDetectedPlatform("macos");
		} else if (userAgent.includes("linux")) {
			setDetectedPlatform("linux");
		} else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
			setDetectedPlatform("ios");
		} else if (userAgent.includes("android")) {
			setDetectedPlatform("android");
		} else {
			setDetectedPlatform("web");
		}
	}, []);

	const platforms = [
		{
			id: "windows",
			name: "Windows",
			icon: Monitor,
			version: "Windows 10+",
			fileSize: "95 MB",
			downloadUrl: "#",
			requirements: "Requires Windows 10 or later",
			color: "from-blue-600 to-cyan-600",
		},
		{
			id: "macos",
			name: "macOS",
			icon: Apple,
			version: "macOS 11+",
			fileSize: "112 MB",
			downloadUrl: "#",
			requirements: "Requires macOS Big Sur or later",
			color: "from-gray-600 to-gray-800",
		},
		{
			id: "linux",
			name: "Linux",
			icon: Monitor,
			version: "Ubuntu 20.04+",
			fileSize: "88 MB",
			downloadUrl: "#",
			requirements: "Compatible with major distributions",
			color: "from-orange-600 to-red-600",
		},
		{
			id: "ios",
			name: "iOS",
			icon: Apple,
			version: "iOS 14+",
			fileSize: "App Store",
			downloadUrl: "#",
			requirements: "Requires iOS 14 or later",
			color: "from-purple-600 to-pink-600",
			storeLink: true,
		},
		{
			id: "android",
			name: "Android",
			icon: Smartphone,
			version: "Android 8+",
			fileSize: "Play Store",
			downloadUrl: "#",
			requirements: "Requires Android 8.0 or later",
			color: "from-green-600 to-emerald-600",
			storeLink: true,
		},
		{
			id: "web",
			name: "Web App",
			icon: Globe,
			version: "All Browsers",
			fileSize: "No Install",
			downloadUrl: "#",
			requirements: "Works on any modern browser",
			color: "from-indigo-600 to-purple-600",
			isWeb: true,
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] relative overflow-hidden">
			{/* Animated background effects */}
			<div className="absolute inset-0 pointer-events-none">
				<motion.div
					animate={{
						opacity: [0.2, 0.4, 0.2],
						scale: [1, 1.2, 1],
					}}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						opacity: [0.15, 0.3, 0.15],
						scale: [1.2, 1, 1.2],
					}}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl"
				/>

				{/* Grid overlay */}
				<div
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10">
				{/* Hero Section */}
				<DownloadHero />

				{/* Platform Cards */}
				<div className="max-w-7xl mx-auto px-6 pb-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Choose Your Platform
						</h2>
						<p className="text-gray-400 text-lg">
							Available for all major operating systems and devices
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{platforms.map((platform, index) => (
							<PlatformCard
								key={platform.id}
								platform={platform}
								index={index}
								isRecommended={detectedPlatform === platform.id}
							/>
						))}
					</div>

					{/* Additional Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.6 }}
						className="mt-16 p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10"
					>
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-xl bg-purple-600/20">
								<Info className="w-6 h-6 text-purple-400" />
							</div>
							<div>
								<h3 className="text-xl font-bold text-white mb-2">
									Safe & Secure Downloads
								</h3>
								<p className="text-gray-400 leading-relaxed">
									All downloads are verified and signed. Your privacy and
									security are our top priority. Every release is scanned for
									malware and comes with automatic updates to keep you
									protected.
								</p>
							</div>
						</div>
					</motion.div>

					{/* Release Notes */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.7 }}
						className="mt-8 text-center"
					>
						<a
							href="#"
							className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
						>
							<span className="text-sm font-medium">
								View Release Notes & What's New
							</span>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
