import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import {
	ArrowRight,
	Check,
	CheckCircle2,
	ChevronDown,
	Crown,
	Gift,
	Headphones,
	Loader2,
	Shield,
	Sparkles,
	Star,
	Users,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button";
import { motion } from "@/components/motion";
import { RootHeader } from "@/components/root-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/domains/home/footer";
import { PLANS } from "@/domains/plans/plans.constants";
import { useCreateCheckout } from "@/hooks/usePolar";
import { logger } from "@/lib/logger";
import { cn, getCurrentUrl } from "@/lib/utils";
import type { CheckoutInputScheme } from "@/types/subscription";

/* ------------------------------------------------------------------ */
/*  Route                                                              */
/* ------------------------------------------------------------------ */

interface PricingSearch {
	redirectUrl?: string;
}

export const Route = createFileRoute("/(home)/pricing")({
	validateSearch: (search: Record<string, unknown>): PricingSearch => ({
		redirectUrl:
			typeof search.redirectUrl === "string" ? search.redirectUrl : undefined,
	}),
	component: PricingPage,
});

/* ------------------------------------------------------------------ */
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
	Sparkles,
	Zap,
	Crown,
};

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function PricingPage() {
	const { redirectUrl } = Route.useSearch();
	const router = useRouter();
	const navigate = useNavigate();
	const auth = router.options.context?.auth;
	const user = auth?.user;
	const createCheckout = useCreateCheckout();

	const [isAnnual, setIsAnnual] = useState(false);
	const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

	/* derive filtered plans */
	const plans = useMemo(() => {
		return PLANS.filter((p) => {
			if (p.slug === "Free") return true;
			if (!isAnnual && p.price.interval === "month") return true;
			if (isAnnual && p.price.interval === "year") return true;
			return false;
		}).map((p) => ({ ...p, icon: ICON_MAP[p.icon] ?? Sparkles }));
	}, [isAnnual]);

	/* checkout handler */
	const handleCheckout = async (plan: CheckoutInputScheme) => {
		try {
			const redirectPath = getCurrentUrl();
			if (!user) {
				toast.error("Authentication required", {
					description:
						"Please log in or create an account to continue with your subscription.",
				});
				navigate({ to: "/login", search: { redirectUrl: redirectPath } });
				return;
			}
			if (plan.slug === "Free") {
				toast.info("You're currently on the Free plan.", {
					description: "Upgrade anytime to unlock premium features.",
				});
				return;
			}
			if (!plan.productId) {
				toast.error("Plan unavailable", {
					description:
						"This subscription option is temporarily unavailable. Please try again later.",
				});
				return;
			}

			setLoadingSlug(plan.slug ?? null);

			const result = await createCheckout.mutateAsync({
				productPriceId: plan.productId,
				successUrl:
					redirectUrl ||
					`${window.location.origin}/success?checkout_id={CHECKOUT_ID}`,
			});

			if (result.url) {
				window.location.href = result.url;
			} else {
				throw new Error("No checkout URL received");
			}
		} catch (err: unknown) {
			logger.error("Checkout error:", err);
			toast.error("Failed to create checkout session");
		} finally {
			setLoadingSlug(null);
		}
	};

	return (
		<>
			<RootHeader />

			<div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
				{/* --------- BACKGROUND --------- */}
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-transparent to-cyan-900/10" />
					<motion.div
						animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
						transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
						className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
					/>
					<motion.div
						animate={{ scale: [1.15, 1, 1.15], opacity: [0.08, 0.18, 0.08] }}
						transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
						className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
					/>
					{/* grid overlay */}
					<div
						className="absolute inset-0 opacity-[0.03]"
						style={{
							backgroundImage:
								"linear-gradient(rgba(139,92,246,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.5) 1px,transparent 1px)",
							backgroundSize: "60px 60px",
						}}
					/>
				</div>

				{/* --------- CONTENT --------- */}
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
					{/* HEADER */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<Badge className="bg-purple-500/15 text-purple-300 border-purple-500/25 mb-6 py-1.5 px-4">
							<Star className="w-3.5 h-3.5 mr-1.5" />
							Simple, transparent pricing
						</Badge>

						<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
							Choose Your{" "}
							<span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
								Perfect Plan
							</span>
						</h1>
						<p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
							Premium entertainment for everyone. Start free, upgrade anytime.
							Cancel with one click&nbsp;— no hidden fees.
						</p>

						{/* Billing Toggle */}
						<div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
							<button
								type="button"
								onClick={() => setIsAnnual(false)}
								className={cn(
									"px-5 py-2 rounded-full text-sm font-medium transition-all",
									!isAnnual
										? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
										: "text-gray-400 hover:text-white",
								)}
							>
								Monthly
							</button>
							<button
								type="button"
								onClick={() => setIsAnnual(true)}
								className={cn(
									"px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
									isAnnual
										? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
										: "text-gray-400 hover:text-white",
								)}
							>
								Annual
								<span className="text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5">
									SAVE 17%
								</span>
							</button>
						</div>
					</motion.div>

					{/* PLAN CARDS */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
						{plans.map((plan, idx) => {
							const isCurrentPlan = user?.currentPlan === plan.slug;
							const isPopular = plan.popular && !isCurrentPlan;
							const isLoading = loadingSlug === plan.slug;
							const isDisabled =
								loadingSlug !== null && loadingSlug !== plan.slug;
							const isPaid = plan.slug !== "Free";
							const hasSubscription =
								user?.subscriptionStatus !== "FREE" &&
								user?.subscriptionStatus !== undefined &&
								user?.currentPlan;

							let ctaText = plan.cta;
							if (isCurrentPlan) ctaText = "Current Plan";
							else if (hasSubscription && isPaid) ctaText = "Switch Plan";

							return (
								<motion.div
									key={plan.slug}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.1, duration: 0.5 }}
									className={cn(
										"relative",
										isDisabled && "opacity-50 pointer-events-none",
									)}
								>
									{/* Badges */}
									{isCurrentPlan && (
										<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
											<Badge className="bg-linear-to-r from-green-600 to-emerald-600 text-white border-0 px-4 py-1 shadow-lg shadow-green-500/25">
												<CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
												Active Plan
											</Badge>
										</div>
									)}
									{isPopular && (
										<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
											<Badge className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1 shadow-lg shadow-purple-500/25">
												<Zap className="w-3.5 h-3.5 mr-1.5" />
												Most Popular
											</Badge>
										</div>
									)}

									<Card
										className={cn(
											"relative overflow-hidden bg-white/3 backdrop-blur-xl border p-7 h-full transition-all duration-300 flex flex-col",
											isCurrentPlan
												? "border-green-500/40 bg-green-500/5 ring-2 ring-green-500/25 md:scale-[1.03]"
												: isPopular
													? "border-purple-500/30 hover:border-purple-500/50 md:scale-[1.03]"
													: "border-white/10 hover:border-white/20 hover:bg-white/5",
										)}
									>
										{/* Glow effect for popular */}
										{(isPopular || isCurrentPlan) && (
											<div
												className={cn(
													"absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 rounded-full blur-3xl opacity-20",
													isCurrentPlan ? "bg-green-500" : "bg-purple-500",
												)}
											/>
										)}

										<div className="relative flex-1">
											{/* Icon + name */}
											<div className="flex items-center gap-3 mb-4">
												<div
													className={cn(
														"p-2.5 rounded-xl bg-linear-to-br",
														plan.gradient,
													)}
												>
													<plan.icon className="w-6 h-6 text-white" />
												</div>
												<div>
													<h3 className="text-xl font-bold text-white">
														{plan.name}
													</h3>
													<p className="text-sm text-gray-500">
														{plan.description}
													</p>
												</div>
											</div>

											{/* Price */}
											<div className="mb-6">
												<div className="flex items-baseline gap-1">
													<span className="text-4xl font-extrabold text-white">
														${plan.price.amount.toFixed(2)}
													</span>
													<span className="text-gray-500 text-sm">
														/{plan.price.interval === "month" ? "mo" : "yr"}
													</span>
												</div>
												{plan.price.interval === "year" &&
													plan.price.amount > 0 && (
														<p className="text-xs text-gray-500 mt-1">
															${(plan.price.amount / 12).toFixed(2)}/mo billed
															annually
														</p>
													)}
											</div>

											{/* Features */}
											<div className="space-y-3 mb-8">
												{plan.features.map((feature) => (
													<div
														key={feature}
														className="flex items-start gap-2.5"
													>
														<div
															className={cn(
																"p-0.5 rounded-full mt-0.5 shrink-0",
																isCurrentPlan
																	? "bg-green-500/20"
																	: `bg-linear-to-br ${plan.gradient} bg-opacity-20`,
															)}
														>
															<Check
																className={cn(
																	"w-3.5 h-3.5",
																	isCurrentPlan
																		? "text-green-400"
																		: "text-white",
																)}
															/>
														</div>
														<span className="text-sm text-gray-300">
															{feature}
														</span>
													</div>
												))}
											</div>
										</div>

										{/* CTA */}
										<div className="space-y-2.5 mt-auto">
											{isCurrentPlan ? (
												<>
													<Button
														disabled
														className="w-full bg-green-600/20 text-green-400 border border-green-500/30 font-semibold py-5 rounded-xl cursor-default"
													>
														<CheckCircle2 className="w-4 h-4 mr-2" />
														Current Plan
													</Button>
													{isPaid && (
														<div className="flex gap-2">
															<CancelSubscriptionButton />
															<Button
																asChild
																variant="outline"
																size="sm"
																className="flex-1 border-white/20 hover:bg-white/5 text-xs"
															>
																<a href="/api/portal">Manage Billing</a>
															</Button>
														</div>
													)}
												</>
											) : (
												<Button
													disabled={isLoading || isDisabled}
													onClick={() => handleCheckout({ slug: plan.slug })}
													className={cn(
														"w-full font-semibold py-5 rounded-xl transition-all duration-200",
														isPopular || plan.popular
															? `bg-linear-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg shadow-purple-500/15`
															: "bg-white/5 hover:bg-white/10 border border-white/20 text-white",
													)}
												>
													{isLoading ? (
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													) : (
														<ArrowRight className="w-4 h-4 mr-2" />
													)}
													{ctaText}
												</Button>
											)}
										</div>
									</Card>
								</motion.div>
							);
						})}
					</div>

					{/* TRUST BADGES */}
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex flex-wrap justify-center gap-6 md:gap-10 mb-20"
					>
						{[
							{ icon: Shield, text: "Secure Checkout" },
							{ icon: Gift, text: "7-Day Free Trial" },
							{ icon: Users, text: "6M+ Subscribers" },
							{ icon: Headphones, text: "24/7 Support" },
						].map(({ icon: Icon, text }) => (
							<div
								key={text}
								className="flex items-center gap-2 text-gray-400 text-sm"
							>
								<Icon className="w-4 h-4 text-purple-400" />
								{text}
							</div>
						))}
					</motion.div>

					{/* COMPARISON TABLE */}
					<ComparisonTable isAnnual={isAnnual} />

					{/* FAQ */}
					<FaqAccordion />

					{/* CTA BANNER */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mt-20 rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 via-transparent to-pink-900/20 p-10 text-center"
					>
						<h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
							Ready to start streaming?
						</h2>
						<p className="text-gray-400 mb-6 max-w-lg mx-auto">
							Join millions of viewers. Start your free trial today and unlock
							the full Vibe experience.
						</p>
						<Button
							onClick={() => {
								if (!user) {
									navigate({ to: "/register" });
								} else {
									document
										.querySelector("#pricing-cards")
										?.scrollIntoView({ behavior: "smooth" });
								}
							}}
							className="bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold"
						>
							Get Started Free
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</motion.div>
				</div>
			</div>

			<Footer />
		</>
	);
}

/* ------------------------------------------------------------------ */
/*  COMPARISON TABLE                                                   */
/* ------------------------------------------------------------------ */

const COMPARE_FEATURES = [
	{
		name: "Music Streaming",
		free: "Limited",
		premium: "Unlimited",
		family: "Unlimited",
	},
	{
		name: "Movies & Shows",
		free: "Ad-supported",
		premium: "Ad-free",
		family: "Ad-free",
	},
	{
		name: "Video Quality",
		free: "SD",
		premium: "Full HD",
		family: "4K Ultra HD",
	},
	{ name: "Simultaneous Devices", free: "1", premium: "3", family: "6" },
	{ name: "Offline Downloads", free: false, premium: true, family: true },
	{ name: "Family Profiles", free: false, premium: false, family: true },
	{ name: "Parental Controls", free: false, premium: false, family: true },
	{ name: "AI Recommendations", free: false, premium: true, family: true },
	{ name: "Early Access Content", free: false, premium: true, family: true },
	{ name: "Priority Support", free: false, premium: false, family: true },
] as const;

function ComparisonTable({ isAnnual }: { isAnnual: boolean }) {
	const [expanded, setExpanded] = useState(false);
	const visible = expanded ? COMPARE_FEATURES : COMPARE_FEATURES.slice(0, 5);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			className="max-w-4xl mx-auto"
		>
			<h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
				Compare Plans
			</h2>

			<div className="rounded-xl border border-white/10 bg-white/3 backdrop-blur-xl overflow-hidden">
				{/* Header */}
				<div className="grid grid-cols-4 gap-4 p-4 border-b border-white/10 bg-white/3">
					<div className="text-sm font-semibold text-gray-400">Feature</div>
					<div className="text-sm font-semibold text-gray-300 text-center">
						Free
					</div>
					<div className="text-sm font-semibold text-purple-300 text-center">
						Premium
					</div>
					<div className="text-sm font-semibold text-cyan-300 text-center">
						Family
					</div>
				</div>

				{/* Rows */}
				{visible.map((feat) => (
					<div
						key={feat.name}
						className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 hover:bg-white/3 transition-colors"
					>
						<div className="text-sm text-gray-300">{feat.name}</div>
						{(["free", "premium", "family"] as const).map((tier) => {
							const val = feat[tier];
							if (typeof val === "boolean") {
								return (
									<div key={tier} className="flex justify-center">
										{val ? (
											<Check className="w-4 h-4 text-green-400" />
										) : (
											<span className="text-gray-600">—</span>
										)}
									</div>
								);
							}
							return (
								<div key={tier} className="text-sm text-gray-400 text-center">
									{val}
								</div>
							);
						})}
					</div>
				))}
			</div>

			{COMPARE_FEATURES.length > 5 && (
				<div className="flex justify-center mt-4">
					<button
						type="button"
						onClick={() => setExpanded(!expanded)}
						className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
					>
						{expanded
							? "Show less"
							: `Show all ${COMPARE_FEATURES.length} features`}
						<ChevronDown
							className={cn(
								"w-4 h-4 transition-transform",
								expanded && "rotate-180",
							)}
						/>
					</button>
				</div>
			)}
		</motion.div>
	);
}

/* ------------------------------------------------------------------ */
/*  FAQ ACCORDION                                                      */
/* ------------------------------------------------------------------ */

const FAQS = [
	{
		q: "Can I cancel anytime?",
		a: "Absolutely. You can cancel your subscription at any time from your account settings. Your access continues until the end of your current billing period — no penalties, no questions asked.",
	},
	{
		q: "What's included in the free trial?",
		a: "You get 7 days of full Premium access with all features unlocked, including ad-free streaming, HD quality, and offline downloads. No credit card required to start.",
	},
	{
		q: "Can I switch plans later?",
		a: "Yes! You can upgrade or downgrade your plan anytime. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at your next billing cycle.",
	},
	{
		q: "How does the Family plan work?",
		a: "The Family plan lets up to 6 members share one subscription. Each member gets their own profile, personal recommendations, and separate watch history. The plan owner manages the family through their account settings.",
	},
	{
		q: "What payment methods do you accept?",
		a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and selected regional payment methods. All payments are processed securely through our payment partner Polar.",
	},
	{
		q: "Is my payment information secure?",
		a: "Yes. We never store your payment details on our servers. All transactions are handled by Polar with PCI-DSS compliant encryption and fraud protection.",
	},
];

function FaqAccordion() {
	const [openIdx, setOpenIdx] = useState<number | null>(null);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className="max-w-3xl mx-auto mt-20"
		>
			<h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
				Frequently Asked Questions
			</h2>

			<div className="space-y-3">
				{FAQS.map((faq, idx) => {
					const isOpen = openIdx === idx;
					return (
						<div
							key={faq.q}
							className="rounded-xl border border-white/10 bg-white/3 backdrop-blur-xl overflow-hidden transition-colors hover:bg-white/5"
						>
							<button
								type="button"
								onClick={() => setOpenIdx(isOpen ? null : idx)}
								className="w-full flex items-center justify-between p-5 text-left"
							>
								<span className="font-medium text-white pr-4">{faq.q}</span>
								<ChevronDown
									className={cn(
										"w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200",
										isOpen && "rotate-180 text-purple-400",
									)}
								/>
							</button>
							<motion.div
								initial={false}
								animate={{
									height: isOpen ? "auto" : 0,
									opacity: isOpen ? 1 : 0,
								}}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
									{faq.a}
								</p>
							</motion.div>
						</div>
					);
				})}
			</div>
		</motion.div>
	);
}
