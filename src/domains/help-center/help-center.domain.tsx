import { AnimatePresence, motion } from "framer-motion";
import {
	Book,
	CheckCircle,
	ChevronDown,
	ChevronRight,
	CreditCard,
	ExternalLink,
	Headphones,
	HelpCircle,
	Mail,
	MessageCircle,
	Phone,
	Search,
	Settings,
	Shield,
	Smartphone,
	Users,
	Video,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HelpCenter() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("all");
	const [expandedFaq, setExpandedFaq] = useState(null);

	const categories = [
		{ id: "all", label: "All Topics", icon: Book },
		{ id: "account", label: "Account & Billing", icon: CreditCard },
		{ id: "streaming", label: "Streaming & Playback", icon: Video },
		{ id: "downloads", label: "Downloads", icon: Smartphone },
		{ id: "audio", label: "Audio Quality", icon: Headphones },
		{ id: "privacy", label: "Privacy & Security", icon: Shield },
		{ id: "features", label: "Features", icon: Settings },
	];

	const faqs = [
		{
			id: 1,
			category: "account",
			question: "How do I cancel my subscription?",
			answer:
				"You can cancel your subscription anytime from your account settings. Go to Settings > Subscription > Cancel Plan. Your access will continue until the end of your current billing period.",
		},
		{
			id: 2,
			category: "account",
			question: "Can I change my payment method?",
			answer:
				"Yes, navigate to Settings > Payment Methods. You can add, remove, or set a default payment method. Changes take effect immediately for future billing cycles.",
		},
		{
			id: 3,
			category: "streaming",
			question: "Why is my video buffering?",
			answer:
				"Buffering can occur due to slow internet connection, network congestion, or device performance. Try lowering the video quality in settings, restarting your router, or closing other apps using bandwidth.",
		},
		{
			id: 4,
			category: "streaming",
			question: "What internet speed do I need?",
			answer:
				"For SD quality: 3 Mbps, HD quality: 5 Mbps, 4K quality: 25 Mbps. We recommend a stable connection with speeds above the minimum for best experience.",
		},
		{
			id: 5,
			category: "downloads",
			question: "How do I download content for offline viewing?",
			answer:
				'Tap the download icon next to any song, album, or video. Downloaded content is available in the "Downloads" section and can be played without internet connection.',
		},
		{
			id: 6,
			category: "downloads",
			question: "How much storage do downloads use?",
			answer:
				"Storage varies by quality: Music (3-10 MB per song), SD video (500 MB per hour), HD video (1.5 GB per hour), 4K video (7 GB per hour).",
		},
		{
			id: 7,
			category: "audio",
			question: "How do I adjust audio quality?",
			answer:
				"Go to Settings > Audio Quality. Choose from Normal (96 kbps), High (160 kbps), or Very High (320 kbps). Higher quality uses more data and storage.",
		},
		{
			id: 8,
			category: "audio",
			question: "Why does the sound cut out?",
			answer:
				"This may be due to Bluetooth interference, low battery, or background app activity. Try reconnecting your audio device, closing background apps, or using wired headphones.",
		},
		{
			id: 9,
			category: "privacy",
			question: "How is my data protected?",
			answer:
				"We use industry-standard encryption (AES-256) for data transmission and storage. Your payment information is processed through PCI-compliant secure gateways. We never sell your personal data.",
		},
		{
			id: 10,
			category: "privacy",
			question: "Can I make my profile private?",
			answer:
				'Yes, go to Settings > Privacy and toggle "Private Profile". This hides your playlists and listening activity from other users.',
		},
		{
			id: 11,
			category: "features",
			question: "How do I create a playlist?",
			answer:
				'Click the "Create Playlist" button in the sidebar, name your playlist, then add songs by clicking the three-dot menu on any track and selecting "Add to Playlist".',
		},
		{
			id: 12,
			category: "features",
			question: "Can I share playlists with friends?",
			answer:
				"Absolutely! Open any playlist, click the share button, and choose how you want to share—via link, social media, or directly to other users on the platform.",
		},
	];

	const quickLinks = [
		{ title: "Getting Started Guide", icon: Book, time: "5 min read" },
		{
			title: "Subscription Plans Comparison",
			icon: CreditCard,
			time: "3 min read",
		},
		{
			title: "Troubleshooting Playback Issues",
			icon: Video,
			time: "7 min read",
		},
		{ title: "Privacy Policy", icon: Shield, time: "10 min read" },
	];

	const contactOptions = [
		{
			icon: MessageCircle,
			title: "Live Chat",
			description: "Chat with our support team",
			availability: "Available 24/7",
			action: "Start Chat",
			color: "from-green-600 to-emerald-600",
		},
		{
			icon: Mail,
			title: "Email Support",
			description: "We will respond within 24 hours",
			availability: "support@vibe.com",
			action: "Send Email",
			color: "from-blue-600 to-cyan-600",
		},
		{
			icon: Phone,
			title: "Phone Support",
			description: "Speak with a specialist",
			availability: "Mon-Fri, 9AM-6PM EST",
			action: "Call Now",
			color: "from-purple-600 to-pink-600",
		},
	];

	const filteredFaqs =
		activeCategory === "all"
			? faqs
			: faqs.filter((faq) => faq.category === activeCategory);

	const searchedFaqs = searchQuery
		? filteredFaqs.filter(
				(faq) =>
					faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
					faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: filteredFaqs;

	return (
		<div className="min-h-screen bg-black">
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]" />

				<div className="relative max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<HelpCircle className="w-16 h-16 text-purple-500 mx-auto mb-6" />
						<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
							How can we help you?
						</h1>
						<p className="text-xl text-gray-400 mb-10">
							Search our knowledge base or browse categories below
						</p>

						{/* Search Bar */}
						<div className="relative max-w-2xl mx-auto">
							<Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
							<Input
								type="text"
								placeholder="Search for help..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-16 pr-6 py-6 text-lg bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 rounded-2xl"
							/>
						</div>

						{/* Quick Stats */}
						<div className="mt-12 flex items-center justify-center gap-8 text-sm">
							<div className="flex items-center gap-2 text-gray-400">
								<CheckCircle className="w-5 h-5 text-green-500" />
								<span>24/7 Support Available</span>
							</div>
							<div className="flex items-center gap-2 text-gray-400">
								<CheckCircle className="w-5 h-5 text-green-500" />
								<span>Average Response: 2 hours</span>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Categories */}
			<section className="max-w-7xl mx-auto px-6 mb-16">
				<div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
					{categories.map((category) => (
						<motion.button
							key={category.id}
							whileHover={{ y: -2 }}
							onClick={() => setActiveCategory(category.id)}
							className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
								activeCategory === category.id
									? "bg-purple-600 text-white"
									: "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
							}`}
						>
							<category.icon className="w-5 h-5" />
							<span className="font-medium">{category.label}</span>
						</motion.button>
					))}
				</div>
			</section>

			{/* Quick Links */}
			<section className="max-w-7xl mx-auto px-6 mb-16">
				<h2 className="text-2xl font-bold text-white mb-6">Popular Articles</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{quickLinks.map((link, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ y: -4 }}
							className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer group transition-all"
						>
							<link.icon className="w-8 h-8 text-purple-500 mb-4" />
							<h3 className="text-white font-semibold mb-2 group-hover:text-purple-400 transition-colors">
								{link.title}
							</h3>
							<p className="text-sm text-gray-400">{link.time}</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* FAQ Section */}
			<section className="max-w-4xl mx-auto px-6 mb-16">
				<h2 className="text-3xl font-bold text-white mb-8">
					Frequently Asked Questions
				</h2>

				{searchedFaqs.length === 0 ? (
					<div className="text-center py-12">
						<HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
						<p className="text-gray-400 text-lg">
							No results found. Try a different search.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{searchedFaqs.map((faq, index) => (
							<motion.div
								key={faq.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.07] transition-colors"
							>
								<button
									onClick={() =>
										setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
									}
									className="w-full px-6 py-5 flex items-center justify-between text-left"
								>
									<span className="text-lg font-semibold text-white pr-8">
										{faq.question}
									</span>
									<motion.div
										animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
										transition={{ duration: 0.3 }}
									>
										<ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
									</motion.div>
								</button>

								<AnimatePresence>
									{expandedFaq === faq.id && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="overflow-hidden"
										>
											<div className="px-6 pb-5 pt-2">
												<p className="text-gray-300 leading-relaxed">
													{faq.answer}
												</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</div>
				)}
			</section>

			{/* Contact Support */}
			<section className="max-w-7xl mx-auto px-6 mb-20">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-white mb-4">
						Still need help?
					</h2>
					<p className="text-xl text-gray-400">
						Our support team is here for you
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{contactOptions.map((option, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ y: -4 }}
							className="relative group"
						>
							<div
								className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"
								style={{
									backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
								}}
							/>

							<div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
								<div
									className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-6`}
								>
									<option.icon className="w-7 h-7 text-white" />
								</div>

								<h3 className="text-xl font-bold text-white mb-2">
									{option.title}
								</h3>
								<p className="text-gray-400 mb-1">{option.description}</p>
								<p className="text-sm text-gray-500 mb-6">
									{option.availability}
								</p>

								<Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
									{option.action}
									<ExternalLink className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Community Section */}
			<section className="border-t border-white/5">
				<div className="max-w-4xl mx-auto px-6 py-20 text-center">
					<Users className="w-12 h-12 text-purple-500 mx-auto mb-6" />
					<h2 className="text-3xl font-bold text-white mb-4">
						Join Our Community
					</h2>
					<p className="text-xl text-gray-400 mb-8">
						Connect with other users, share tips, and get help from the
						community
					</p>
					<Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
						Visit Community Forum
						<ChevronRight className="w-5 h-5 ml-2" />
					</Button>
				</div>
			</section>
		</div>
	);
}
