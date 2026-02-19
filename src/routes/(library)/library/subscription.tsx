import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowRight,
	ArrowUpRight,
	Calendar,
	Check,
	CheckCircle2,
	CreditCard,
	Crown,
	Download,
	ExternalLink,
	Film,
	type LucideIcon,
	Repeat,
	Shield,
	Sparkles,
	XCircle,
	Zap,
} from "lucide-react";
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button";
import { motion } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PLANS, type PlanSlug } from "@/domains/plans/plans.constants";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(library)/library/subscription")({
	component: SubscriptionPage,
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, LucideIcon> = { Sparkles, Zap, Crown };

function getPlanDetails(planSlug: string | null) {
	const slug = (planSlug || "Free") as PlanSlug;
	const plan = PLANS.find((p) => p.slug === slug) || PLANS[0];
	return {
		name: plan.name,
		icon: ICON_MAP[plan.icon] || Sparkles,
		gradient: `bg-linear-to-br ${plan.gradient}`,
		description: plan.description,
		features: plan.features,
		price: plan.price,
		slug: plan.slug,
	};
}

function formatDate(dateStr: string | null | undefined) {
	if (!dateStr) return "—";
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date(dateStr));
}

function formatCurrency(amount: number | undefined, currency?: string) {
	if (!amount) return "$0.00";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency || "USD",
	}).format(amount / 100);
}

function daysUntil(dateStr: string | null | undefined) {
	if (!dateStr) return null;
	const diff = new Date(dateStr).getTime() - Date.now();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function SubscriptionPage() {
	const { subscription, isLoading, isActive, isPending, isFree } =
		useSubscription();

	if (isLoading) return <SubscriptionSkeleton />;

	const plan = getPlanDetails(subscription?.currentPlan ?? null);
	const renewalDays = daysUntil(subscription?.currentPeriodEnd);

	return (
		<div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 text-white">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16">
				{/* Header */}
				<motion.header
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-10"
				>
					<h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
						Subscription
					</h1>
					<p className="text-gray-400">
						Manage your plan, billing, and subscription settings
					</p>
				</motion.header>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* LEFT — 2/3 */}
					<div className="lg:col-span-2 space-y-6">
						{/* Current Plan Card */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.05 }}
						>
							<Card className="bg-white/5 backdrop-blur-xl border-white/10 p-7 relative overflow-hidden">
								{/* top accent */}
								<div
									className={cn(
										"absolute top-0 left-0 right-0 h-1",
										isActive
											? "bg-linear-to-r from-purple-500 to-pink-500"
											: isFree
												? "bg-gray-700"
												: "bg-amber-500",
									)}
								/>

								<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
									<div className="flex items-center gap-4">
										<div className={cn("p-3 rounded-2xl", plan.gradient)}>
											<plan.icon className="w-7 h-7 text-white" />
										</div>
										<div>
											<h2 className="text-2xl font-bold text-white">
												{plan.name}
											</h2>
											<p className="text-sm text-gray-400">
												{subscription?.currentPlan || "Free Plan"}
											</p>
										</div>
									</div>
									<StatusBadge
										isActive={isActive}
										isPending={isPending}
										isFree={isFree}
										status={subscription?.status || "FREE"}
									/>
								</div>

								{/* Price + billing cycle */}
								{!isFree && subscription?.amount != null && (
									<div className="flex items-baseline gap-2 mb-6">
										<span className="text-3xl font-extrabold text-white">
											{formatCurrency(
												subscription.amount,
												subscription.currency,
											)}
										</span>
										<span className="text-gray-500 text-sm">
											/{subscription.interval || "month"}
										</span>
									</div>
								)}

								<p className="text-gray-300 text-sm mb-6">{plan.description}</p>

								<Separator className="bg-white/10 mb-6" />

								{/* Features grid */}
								<div className="mb-6">
									<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
										Included Features
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
										{plan.features.map((feature: string) => (
											<div key={feature} className="flex items-start gap-2">
												<div
													className={cn(
														"p-0.5 rounded-full mt-0.5 shrink-0",
														plan.gradient,
													)}
												>
													<Check className="w-3 h-3 text-white" />
												</div>
												<span className="text-sm text-gray-300">{feature}</span>
											</div>
										))}
									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-wrap gap-3">
									{!isFree && (
										<>
											<Button
												asChild
												variant="outline"
												className="border-white/15 hover:bg-white/5"
											>
												<a
													href="/api/portal"
													target="_blank"
													rel="noopener noreferrer"
												>
													<CreditCard className="w-4 h-4 mr-2" />
													Manage Billing
													<ExternalLink className="w-3 h-3 ml-2" />
												</a>
											</Button>
											{isActive && <CancelSubscriptionButton />}
										</>
									)}
									<Button
										asChild
										className={cn(
											"rounded-xl",
											isFree
												? "bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
												: "bg-white/10 hover:bg-white/15 text-white",
										)}
									>
										<Link to="/pricing">
											{isFree ? "Upgrade Plan" : "Change Plan"}
											<ArrowRight className="w-4 h-4 ml-2" />
										</Link>
									</Button>
								</div>
							</Card>
						</motion.div>

						{/* Cancellation notice */}
						{isPending && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
							>
								<Card className="bg-amber-500/8 border-amber-500/25 backdrop-blur-xl p-5">
									<div className="flex items-start gap-3">
										<AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
										<div>
											<h3 className="font-semibold text-amber-300 mb-1 text-sm">
												Cancellation Scheduled
											</h3>
											<p className="text-xs text-amber-200/70">
												Your subscription remains active until{" "}
												{formatDate(subscription?.currentPeriodEnd)}. You'll
												continue to have full access until then.
											</p>
										</div>
									</div>
								</Card>
							</motion.div>
						)}

						{/* Billing Details Card */}
						{!isFree && (
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
							>
								<Card className="bg-white/5 backdrop-blur-xl border-white/10 p-7">
									<h3 className="text-lg font-semibold text-white mb-5">
										Billing Information
									</h3>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<BillingItem
											icon={Calendar}
											label="Current Period"
											value={`${formatDate(undefined)} — ${formatDate(subscription?.currentPeriodEnd)}`}
										/>
										<BillingItem
											icon={Repeat}
											label="Next Renewal"
											value={
												isPending
													? "Cancelled — no renewal"
													: renewalDays !== null
														? `${formatDate(subscription?.currentPeriodEnd)} (${renewalDays} days)`
														: "—"
											}
										/>
										<BillingItem
											icon={CreditCard}
											label="Amount"
											value={formatCurrency(
												subscription?.amount,
												subscription?.currency,
											)}
										/>
										<BillingItem
											icon={Shield}
											label="Payment Method"
											value="Managed via Polar"
										/>
									</div>

									<Separator className="bg-white/10 my-5" />

									<div className="flex items-center justify-between">
										<p className="text-xs text-gray-500">
											Need an invoice or receipt?
										</p>
										<Button
											asChild
											variant="ghost"
											size="sm"
											className="text-purple-400 hover:text-purple-300 text-xs"
										>
											<a
												href="/api/portal"
												target="_blank"
												rel="noopener noreferrer"
											>
												View in billing portal
												<ArrowUpRight className="w-3 h-3 ml-1" />
											</a>
										</Button>
									</div>
								</Card>
							</motion.div>
						)}
					</div>

					{/* RIGHT — 1/3 */}
					<div className="space-y-6">
						{/* Plan Benefits */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.15 }}
						>
							<Card className="bg-linear-to-br from-purple-900/15 via-transparent to-pink-900/15 border-purple-500/15 backdrop-blur-xl p-6">
								<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
									Plan Benefits
								</h3>
								<div className="space-y-3">
									<BenefitRow
										label="Video Quality"
										value={
											isFree
												? "SD"
												: subscription?.currentPlan?.includes("Family")
													? "4K Ultra HD"
													: "Full HD"
										}
										active={!isFree}
									/>
									<BenefitRow
										label="Ads"
										value={isFree ? "Yes" : "None"}
										active={!isFree}
									/>
									<BenefitRow
										label="Downloads"
										value={isFree ? "Limited" : "Unlimited"}
										active={!isFree}
									/>
									<BenefitRow
										label="Devices"
										value={
											isFree
												? "1"
												: subscription?.currentPlan?.includes("Family")
													? "6"
													: "3"
										}
										active={!isFree}
									/>
									<BenefitRow
										label="AI Picks"
										value={isFree ? "Basic" : "Advanced"}
										active={!isFree}
									/>
								</div>
							</Card>
						</motion.div>

						{/* Upgrade CTA */}
						{isFree && (
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<Card className="bg-linear-to-br from-purple-600/15 to-pink-600/15 border-purple-500/25 backdrop-blur-xl p-6">
									<Crown className="w-9 h-9 text-purple-400 mb-3" />
									<h3 className="font-bold text-white text-lg mb-2">
										Go Premium
									</h3>
									<p className="text-sm text-gray-300 mb-4">
										Unlimited ad-free streaming, offline downloads, and HD/4K
										quality.
									</p>
									<Button
										asChild
										className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl"
									>
										<Link to="/pricing">
											See Plans
											<ArrowRight className="w-4 h-4 ml-2" />
										</Link>
									</Button>
								</Card>
							</motion.div>
						)}

						{/* Quick Actions */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.25 }}
						>
							<Card className="bg-white/5 border-white/10 backdrop-blur-xl p-6">
								<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
									Quick Actions
								</h3>
								<div className="space-y-2">
									<QuickAction icon={Film} label="Browse Content" href="/" />
									<QuickAction
										icon={Download}
										label="My Downloads"
										href="/library"
									/>
									<QuickAction
										icon={ExternalLink}
										label="Help Center"
										href="/help-center"
									/>
								</div>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatusBadge({
	isActive,
	isPending,
	isFree,
	status,
}: {
	isActive: boolean;
	isPending: boolean;
	isFree: boolean;
	status: string;
}) {
	if (isFree)
		return (
			<Badge className="bg-slate-500/15 text-slate-300 border-slate-500/25">
				<Sparkles className="w-3 h-3 mr-1" />
				Free
			</Badge>
		);
	if (isPending)
		return (
			<Badge className="bg-amber-500/15 text-amber-300 border-amber-500/25">
				<AlertCircle className="w-3 h-3 mr-1" />
				Cancelling
			</Badge>
		);
	if (isActive)
		return (
			<Badge className="bg-green-500/15 text-green-300 border-green-500/25">
				<CheckCircle2 className="w-3 h-3 mr-1" />
				Active
			</Badge>
		);
	return (
		<Badge className="bg-red-500/15 text-red-300 border-red-500/25">
			<XCircle className="w-3 h-3 mr-1" />
			{status}
		</Badge>
	);
}

function BillingItem({
	icon: Icon,
	label,
	value,
}: {
	icon: LucideIcon;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="p-2 rounded-lg bg-white/5">
				<Icon className="w-4 h-4 text-gray-400" />
			</div>
			<div>
				<p className="text-xs text-gray-500 mb-0.5">{label}</p>
				<p className="text-sm text-white">{value}</p>
			</div>
		</div>
	);
}

function BenefitRow({
	label,
	value,
	active,
}: {
	label: string;
	value: string;
	active: boolean;
}) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-sm text-gray-400">{label}</span>
			<span
				className={cn(
					"text-sm font-semibold",
					active ? "text-purple-300" : "text-gray-600",
				)}
			>
				{value}
			</span>
		</div>
	);
}

function QuickAction({
	icon: Icon,
	label,
	href,
}: {
	icon: LucideIcon;
	label: string;
	href: string;
}) {
	return (
		<Link
			to={href}
			className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group"
		>
			<Icon className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
			<span className="text-sm text-gray-300 group-hover:text-white transition-colors">
				{label}
			</span>
			<ArrowRight className="w-3 h-3 ml-auto text-gray-600 group-hover:text-gray-400 transition-colors" />
		</Link>
	);
}

function SubscriptionSkeleton() {
	return (
		<div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 text-white">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16">
				<div className="mb-10">
					<Skeleton className="h-10 w-48 mb-2" />
					<Skeleton className="h-5 w-80" />
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<Skeleton className="h-80 w-full rounded-xl" />
						<Skeleton className="h-48 w-full rounded-xl" />
					</div>
					<div className="space-y-6">
						<Skeleton className="h-52 w-full rounded-xl" />
						<Skeleton className="h-44 w-full rounded-xl" />
					</div>
				</div>
			</div>
		</div>
	);
}
