import { motion } from "framer-motion";
import { ArrowRight, Check, Crown, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Plans() {
	const [isAnnual, setIsAnnual] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: (e.clientX / window.innerWidth - 0.5) * 20,
				y: (e.clientY / window.innerHeight - 0.5) * 20,
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const plans = [
		{
			name: "Free",
			icon: Sparkles,
			price: { monthly: 0, annual: 0 },
			description: "Perfect for casual listeners",
			features: [
				"Limited music streaming",
				"Ad-supported movies",
				"Standard quality",
				"1 device",
				"Basic recommendations",
			],
			cta: "Get Started",
			popular: false,
			gradient: "from-gray-600 to-gray-700",
			glowColor: "gray-500",
		},
		{
			name: "Premium",
			icon: Zap,
			price: { monthly: 9.99, annual: 99 },
			description: "Best for individuals",
			features: [
				"Unlimited music streaming",
				"Ad-free movies & shows",
				"HD quality",
				"Up to 3 devices",
				"Offline downloads",
				"AI-powered recommendations",
				"Early access to new releases",
			],
			cta: "Start Free Trial",
			popular: true,
			gradient: "from-purple-600 to-pink-600",
			glowColor: "purple-500",
		},
		{
			name: "Family",
			icon: Crown,
			price: { monthly: 14.99, annual: 149 },
			description: "Perfect for the whole family",
			features: [
				"Everything in Premium",
				"Up to 6 family members",
				"Individual profiles",
				"4K Ultra HD quality",
				"Unlimited devices",
				"Parental controls",
				"Priority customer support",
				"Exclusive family playlists",
			],
			cta: "Start Free Trial",
			popular: false,
			gradient: "from-cyan-600 to-blue-600",
			glowColor: "cyan-500",
		},
	];

	return (
		<div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0">
				<motion.div
					style={{
						transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
					}}
					transition={{ type: "spring", stiffness: 50 }}
					className="absolute inset-0"
				>
					<div className="absolute inset-0 bg-linear-to-br from-purple-900/30 via-black to-cyan-900/20" />
				</motion.div>

				{/* Floating orbs */}
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.15, 0.25, 0.15],
					}}
					transition={{ duration: 8, repeat: Infinity }}
					className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.1, 0.2, 0.1],
					}}
					transition={{ duration: 10, repeat: Infinity }}
					className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
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
			<div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 border-purple-500/30 mb-6">
						Pricing Plans
					</Badge>

					<h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
						Choose Your{" "}
						<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
							Perfect Plan
						</span>
					</h1>

					<p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
						Unlimited entertainment for everyone. Start with a 7-day free trial,
						cancel anytime.
					</p>

					{/* Toggle */}
					<div className="inline-flex items-center gap-4 p-2 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10">
						<button
							onClick={() => setIsAnnual(false)}
							className={`px-6 py-2 rounded-full font-medium transition-all ${
								!isAnnual
									? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
									: "text-gray-400 hover:text-white"
							}`}
						>
							Monthly
						</button>
						<button
							onClick={() => setIsAnnual(true)}
							className={`px-6 py-2 rounded-full font-medium transition-all ${
								isAnnual
									? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
									: "text-gray-400 hover:text-white"
							}`}
						>
							Annual
							<Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
								Save 17%
							</Badge>
						</button>
					</div>
				</motion.div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
					{plans.map((plan, index) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className="relative"
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
									<Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1.5">
										Most Popular
									</Badge>
								</div>
							)}

							<Card
								className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 h-full transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 ${
									plan.popular ? "md:scale-105 border-purple-500/30" : ""
								}`}
							>
								{/* Background gradient */}
								<div
									className={`absolute inset-0 bg-linear-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
								/>

								{/* Glow effect */}
								{plan.popular && (
									<div
										className={`absolute inset-0 bg-linear-to-r ${plan.gradient} opacity-20 blur-3xl`}
									/>
								)}

								<div className="relative">
									{/* Icon */}
									<div
										className={`inline-flex p-3 rounded-2xl bg-linear-to-br ${plan.gradient} bg-opacity-20 mb-6`}
									>
										<plan.icon className="w-8 h-8 text-white" />
									</div>

									{/* Plan name */}
									<h3 className="text-2xl font-bold text-white mb-2">
										{plan.name}
									</h3>
									<p className="text-gray-400 mb-6">{plan.description}</p>

									{/* Price */}
									<div className="mb-8">
										<div className="flex items-baseline gap-2">
											<span className="text-5xl font-bold text-white">
												${isAnnual ? plan.price.annual : plan.price.monthly}
											</span>
											{plan.price.monthly > 0 && (
												<span className="text-gray-500">
													/{isAnnual ? "year" : "month"}
												</span>
											)}
										</div>
										{isAnnual && plan.price.annual > 0 && (
											<p className="text-sm text-gray-500 mt-2">
												${(plan.price.annual / 12).toFixed(2)}/month billed
												annually
											</p>
										)}
									</div>

									{/* CTA Button */}
									<Button
										className={`w-full mb-8 ${
											plan.popular
												? `bg-gradient-to-r ${plan.gradient} hover:opacity-90`
												: "bg-white/5 hover:bg-white/10 border border-white/20"
										} text-white font-semibold py-6 rounded-xl transition-all duration-300 group`}
									>
										{plan.cta}
										<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
									</Button>

									{/* Features */}
									<div className="space-y-4">
										{plan.features.map((feature, i) => (
											<motion.div
												key={i}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 + i * 0.05 }}
												className="flex items-start gap-3"
											>
												<div
													className={`p-1 rounded-full bg-gradient-to-br ${plan.gradient} bg-opacity-20 flex-shrink-0 mt-0.5`}
												>
													<Check className="w-4 h-4 text-white" />
												</div>
												<span className="text-gray-300">{feature}</span>
											</motion.div>
										))}
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>

				{/* FAQ Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center max-w-3xl mx-auto"
				>
					<h2 className="text-3xl font-bold text-white mb-6">
						Frequently Asked Questions
					</h2>

					<div className="space-y-4 text-left">
						{[
							{
								q: "Can I cancel anytime?",
								a: "Yes, you can cancel your subscription at any time without any penalties.",
							},
							{
								q: "What's included in the free trial?",
								a: "7 days of full Premium access with all features unlocked.",
							},
							{
								q: "Can I switch plans later?",
								a: "Absolutely! You can upgrade or downgrade your plan anytime.",
							},
						].map((faq, i) => (
							<Card
								key={i}
								className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 hover:bg-white/[0.05] transition-all"
							>
								<h3 className="text-white font-semibold mb-2">{faq.q}</h3>
								<p className="text-gray-400">{faq.a}</p>
							</Card>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
