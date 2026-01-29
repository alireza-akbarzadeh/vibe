import { motion } from "framer-motion";
import {
	CheckCircle,
	Download,
	FileText,
	Globe,
	Headphones,
	Music,
	Radio,
	Shield,
	Smartphone,
	Tv,
	Users,
	XCircle,
} from "lucide-react";
import { useState } from "react";

export function LicenseDomain() {
	const [activeTab, setActiveTab] = useState("software");

	const tabs = [
		{ id: "software", label: "Software License", icon: FileText },
		{ id: "content", label: "Content License", icon: Music },
		{ id: "api", label: "API License", icon: Globe },
	];

	const allowedUses = [
		"Stream unlimited music for personal use",
		"Download songs for offline listening (Premium only)",
		"Create and share playlists publicly",
		"Use on up to 5 devices simultaneously",
		"Access via web, mobile, and desktop applications",
		"Cast to compatible smart devices",
		"Share content links on social media",
		"Use within the terms of Fair Use",
	];

	const prohibitedUses = [
		"Redistribute, sell, or rent content",
		"Remove or bypass DRM protections",
		"Download content using third-party tools",
		"Use for commercial purposes without authorization",
		"Create derivative works from our content",
		"Use automated systems to scrape data",
		"Share account credentials with others",
		"Stream in public venues without proper licensing",
	];

	const deviceLicenses = [
		{
			icon: Smartphone,
			name: "Mobile Apps",
			platforms: "iOS, Android",
			description: "Native mobile applications with offline playback",
		},
		{
			icon: Globe,
			name: "Web Player",
			platforms: "All modern browsers",
			description: "Browser-based streaming with full features",
		},
		{
			icon: Download,
			name: "Desktop Apps",
			platforms: "Windows, macOS, Linux",
			description: "Desktop applications with enhanced audio quality",
		},
		{
			icon: Tv,
			name: "Smart TVs",
			platforms: "Samsung, LG, Android TV",
			description: "Big screen experience for your living room",
		},
		{
			icon: Radio,
			name: "Voice Assistants",
			platforms: "Alexa, Google Assistant",
			description: "Voice-controlled music playback",
		},
		{
			icon: Headphones,
			name: "Gaming Consoles",
			platforms: "PlayStation, Xbox",
			description: "Music streaming while you game",
		},
	];

	return (
		<div className="min-h-screen bg-black">
			{/* Header */}
			<section className="relative pt-32 pb-16 overflow-hidden border-b border-white/5">
				<div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-black" />
				<div className="relative max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<FileText className="w-16 h-16 text-blue-500 mx-auto mb-6" />
						<h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
							License Agreement
						</h1>
						<p className="text-xl text-gray-400 mb-6">
							Terms governing your use of Vibe services and content
						</p>
						<p className="text-sm text-gray-500">
							Last updated: January 29, 2026
						</p>
					</motion.div>
				</div>
			</section>

			{/* Tabs */}
			<section className="border-b border-white/5">
				<div className="max-w-4xl mx-auto px-6">
					<div className="flex gap-4 overflow-x-auto">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
									activeTab === tab.id
										? "border-blue-500 text-white"
										: "border-transparent text-gray-400 hover:text-white"
								}`}
							>
								<tab.icon className="w-5 h-5" />
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</section>

			<div className="max-w-4xl mx-auto px-6 py-16">
				{/* Software License */}
				{activeTab === "software" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-12"
					>
						<section>
							<h2 className="text-3xl font-bold text-white mb-6">
								Software License Agreement
							</h2>
							<div className="prose prose-invert max-w-none">
								<p className="text-gray-300 leading-relaxed mb-4">
									This Software License Agreement governs your use of the Vibe
									applications, including our mobile apps, desktop applications,
									and web player. By using our services, you agree to the terms
									outlined in this agreement.
								</p>
								<p className="text-gray-300 leading-relaxed mb-4">
									Vibe grants you a limited, non-exclusive, non-transferable,
									revocable license to access and use our software applications
									for personal, non-commercial purposes in accordance with these
									terms.
								</p>
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								License Grant
							</h3>
							<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
								<h4 className="text-white font-semibold mb-4">
									Subject to your compliance with this Agreement, Vibe grants
									you:
								</h4>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 text-gray-300">
										<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span>
											A personal, non-commercial license to use our applications
										</span>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span>
											The right to install and use our software on your devices
										</span>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span>
											Access to updates and new features as they become
											available
										</span>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span>
											The ability to access your account across multiple
											platforms
										</span>
									</li>
								</ul>
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								Supported Platforms
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{deviceLicenses.map((device, index) => (
									<div
										key={index}
										className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
									>
										<device.icon className="w-10 h-10 text-blue-500 mb-3" />
										<h4 className="text-white font-semibold mb-1">
											{device.name}
										</h4>
										<p className="text-sm text-gray-400 mb-2">
											{device.platforms}
										</p>
										<p className="text-xs text-gray-500">
											{device.description}
										</p>
									</div>
								))}
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								Restrictions
							</h3>
							<div className="p-6 bg-red-900/10 border border-red-500/20 rounded-xl">
								<h4 className="text-white font-semibold mb-4">You may NOT:</h4>
								<ul className="space-y-3">
									<li className="flex items-start gap-3 text-gray-300">
										<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
										<span>
											Modify, reverse engineer, or decompile the software
										</span>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
										<span>
											Remove copyright notices or proprietary markings
										</span>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
										<span>Distribute, sublicense, or sell the software</span>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
										<span>Use the software for unlawful purposes</span>
									</li>
								</ul>
							</div>
						</section>
					</motion.div>
				)}

				{/* Content License */}
				{activeTab === "content" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-12"
					>
						<section>
							<h2 className="text-3xl font-bold text-white mb-6">
								Content License
							</h2>
							<div className="prose prose-invert max-w-none">
								<p className="text-gray-300 leading-relaxed mb-4">
									All music, videos, podcasts, and other content available
									through Vibe is licensed from content owners and protected by
									intellectual property laws. This section governs your use of
									such content.
								</p>
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								What You Can Do
							</h3>
							<div className="space-y-3">
								{allowedUses.map((use, index) => (
									<div
										key={index}
										className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg"
									>
										<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span className="text-gray-300">{use}</span>
									</div>
								))}
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								What You Cannot Do
							</h3>
							<div className="space-y-3">
								{prohibitedUses.map((use, index) => (
									<div
										key={index}
										className="flex items-start gap-3 p-4 bg-red-900/10 border border-red-500/20 rounded-lg"
									>
										<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
										<span className="text-gray-300">{use}</span>
									</div>
								))}
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								Content Ownership
							</h3>
							<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
								<p className="text-gray-300 leading-relaxed mb-4">
									All content on Vibe remains the property of its respective
									owners. You do not acquire any ownership rights by streaming
									or downloading content. The content is licensed to you solely
									for personal, non-commercial entertainment purposes.
								</p>
								<p className="text-gray-300 leading-relaxed">
									Artists, labels, and publishers retain all rights to their
									content. Vibe operates under licensing agreements with major
									music labels, independent distributors, and performing rights
									organizations.
								</p>
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								Offline Downloads
							</h3>
							<div className="p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
								<div className="flex items-start gap-4">
									<Download className="w-8 h-8 text-blue-400 flex-shrink-0" />
									<div>
										<h4 className="text-white font-semibold mb-2">
											Premium Feature
										</h4>
										<p className="text-gray-300 leading-relaxed mb-3">
											Premium subscribers can download content for offline
											playback. Downloaded content is encrypted and can only be
											played within the Vibe app on authorized devices.
										</p>
										<ul className="space-y-2 text-gray-400 text-sm">
											<li>
												• Downloads expire if your subscription is cancelled
											</li>
											<li>
												• Content must be re-authenticated online every 30 days
											</li>
											<li>
												• Downloaded files cannot be transferred or exported
											</li>
										</ul>
									</div>
								</div>
							</div>
						</section>
					</motion.div>
				)}

				{/* API License */}
				{activeTab === "api" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-12"
					>
						<section>
							<h2 className="text-3xl font-bold text-white mb-6">
								API License Agreement
							</h2>
							<div className="prose prose-invert max-w-none">
								<p className="text-gray-300 leading-relaxed mb-4">
									Vibe provides APIs for developers to integrate our music
									streaming capabilities into their applications. Use of the
									Vibe API is subject to this license agreement and our API
									Terms of Service.
								</p>
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								API Access Tiers
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
									<h4 className="text-xl font-bold text-white mb-3">
										Free Tier
									</h4>
									<ul className="space-y-2 text-gray-400">
										<li>• 1,000 API calls per day</li>
										<li>• Basic endpoints access</li>
										<li>• Community support</li>
										<li>• Attribution required</li>
									</ul>
								</div>
								<div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl">
									<h4 className="text-xl font-bold text-white mb-3">
										Commercial Tier
									</h4>
									<ul className="space-y-2 text-gray-400">
										<li>• Unlimited API calls</li>
										<li>• Full endpoints access</li>
										<li>• Priority support</li>
										<li>• White-label options</li>
									</ul>
								</div>
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								Developer Responsibilities
							</h3>
							<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
								<ul className="space-y-4">
									<li className="flex items-start gap-3 text-gray-300">
										<Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
										<div>
											<strong className="text-white">Security:</strong>{" "}
											Implement proper security measures and keep API keys
											confidential
										</div>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
										<div>
											<strong className="text-white">User Privacy:</strong>{" "}
											Comply with data protection laws and our privacy policy
										</div>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
										<div>
											<strong className="text-white">Attribution:</strong>{" "}
											Display Vibe branding as required by the tier level
										</div>
									</li>
									<li className="flex items-start gap-3 text-gray-300">
										<CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
										<div>
											<strong className="text-white">Compliance:</strong> Follow
											all API usage guidelines and best practices
										</div>
									</li>
								</ul>
							</div>
						</section>

						<section>
							<h3 className="text-2xl font-bold text-white mb-6">
								Rate Limits & Usage
							</h3>
							<div className="p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
								<p className="text-gray-300 leading-relaxed mb-4">
									API rate limits are enforced to ensure fair usage and platform
									stability. Exceeding rate limits may result in temporary
									throttling or suspension of API access.
								</p>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
									<div className="p-4 bg-white/5 rounded-lg">
										<div className="text-2xl font-bold text-white mb-1">
											1,000
										</div>
										<div className="text-sm text-gray-400">
											Free tier daily limit
										</div>
									</div>
									<div className="p-4 bg-white/5 rounded-lg">
										<div className="text-2xl font-bold text-white mb-1">
											100/min
										</div>
										<div className="text-sm text-gray-400">
											Per-minute rate limit
										</div>
									</div>
									<div className="p-4 bg-white/5 rounded-lg">
										<div className="text-2xl font-bold text-white mb-1">
											Unlimited
										</div>
										<div className="text-sm text-gray-400">Commercial tier</div>
									</div>
								</div>
							</div>
						</section>
					</motion.div>
				)}

				{/* Footer Note */}
				<div className="pt-12 mt-12 border-t border-white/10">
					<p className="text-sm text-gray-500 text-center">
						This license agreement may be updated from time to time. Continued
						use of our services constitutes acceptance of the updated terms. For
						questions about licensing, contact{" "}
						<a
							href="mailto:legal@vibe.com"
							className="text-blue-400 hover:underline"
						>
							legal@vibe.com
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
