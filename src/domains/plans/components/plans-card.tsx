import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import type { ComponentType } from "react";
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button";
import { motion } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CheckoutInputScheme } from "@/types/subscription";
import type { PlanType } from "../plans.constants";

type PlanWithIcon = Omit<PlanType, "icon"> & {
	icon: ComponentType<{ className?: string }>;
};

interface PlanCardProps {
	plan: PlanWithIcon;
	index: number;
	isAnnual: boolean;
	isActive?: boolean;
	isLoading?: boolean;
	disabled?: boolean;
	onPlanChange: (plan: CheckoutInputScheme) => void;
	userSubscription?: {
		status: string;
		currentPlan: string | null;
	};
}

export function PlanCard({
	plan,
	index,
	isActive = false,
	isLoading = false,
	disabled = false,
	onPlanChange,
	userSubscription,
}: PlanCardProps) {
	// Check if this is the user's current plan
	const isCurrentPlan = userSubscription?.currentPlan === plan.slug;
	const hasSubscription =
		userSubscription?.status !== "FREE" &&
		userSubscription?.status !== "NONE" &&
		userSubscription?.currentPlan;
	const isPaidPlan = plan.slug !== "Free";

	// Debug logging (can remove later)
	if (import.meta.env.DEV && index === 0) {
		console.log("[PlanCard] User Subscription:", {
			status: userSubscription?.status,
			currentPlan: userSubscription?.currentPlan,
			planSlug: plan.slug,
			isCurrentPlan,
			hasSubscription,
		});
	}

	// Determine button text
	let buttonText = plan.cta;

	if (isCurrentPlan) {
		buttonText = "Current Plan";
	} else if (hasSubscription && isPaidPlan) {
		buttonText = "Change to This Plan";
	}

	return (
		<motion.div
			key={plan.name}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1, duration: 0.6 }}
			className={`relative cursor-pointer transition duration-200 ${
				disabled && !isActive
					? "opacity-60 blur-[1px] pointer-events-none select-none"
					: ""
			}`}
			onClick={() => {
				if (disabled || isCurrentPlan) return;
				onPlanChange({ slug: plan.slug });
			}}
		>
			{/* Current Plan Badge */}
			{isCurrentPlan && (
				<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
					<Badge className="bg-linear-to-r from-green-600 to-emerald-600 text-white border-0 px-4 py-1.5 shadow-lg shadow-green-500/30">
						<CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
						Active Plan
					</Badge>
				</div>
			)}

			{/* Most Popular Badge */}
			{!isCurrentPlan && plan.popular && (
				<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
					<Badge className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1.5">
						Most Popular
					</Badge>
				</div>
			)}

			<Card
				className={`relative overflow-hidden bg-white/3 backdrop-blur-xl border p-8 h-full transition-all duration-300 ${
					isCurrentPlan
						? "border-green-500/50 bg-green-500/5 ring-2 ring-green-500/30 md:scale-105"
						: plan.popular
							? "md:scale-105 border-purple-500/30 hover:border-purple-500/50"
							: "border-white/10 hover:bg-white/5 hover:border-white/20"
				} ${isActive ? "ring-2 ring-purple-500/50 scale-[1.02]" : ""}`}
			>
				<div className="relative">
					{/* Icon */}
					<div
						className={`inline-flex p-3 rounded-2xl bg-linear-to-br ${plan.gradient} bg-opacity-20 mb-6`}
					>
						<plan.icon className="w-8 h-8 text-white" />
					</div>

					{/* Plan Name & Description */}
					<h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
					<p className="text-gray-400 mb-6">{plan.description}</p>

					{/* Price */}
					<div className="mb-8">
						<div className="flex items-baseline gap-2">
							<span className="text-5xl font-bold text-white">
								${plan.price.amount.toFixed(2)}
							</span>
							<span className="text-gray-500">
								/{plan.price.interval === "month" ? "month" : "year"}
							</span>
						</div>
						{plan.price.interval === "year" && plan.price.amount > 0 && (
							<p className="text-sm text-gray-500 mt-2">
								${(plan.price.amount / 12).toFixed(2)}/month billed annually
							</p>
						)}
					</div>

					{/* CTA Button */}
					<div className="mb-8 space-y-3">
						{isCurrentPlan ? (
							<>
								<Button
									disabled
									className="w-full bg-green-600/20 text-green-400 border border-green-500/30 font-semibold py-6 rounded-xl cursor-default"
								>
									<CheckCircle2 className="w-5 h-5 mr-2" />
									Current Plan
								</Button>
								{isPaidPlan && (
									<div className="flex gap-2">
										<CancelSubscriptionButton />
										<Button
											asChild
											variant="outline"
											className="flex-1 border-white/20 hover:bg-white/5"
										>
											<Link to="/api/portal">Manage</Link>
										</Button>
									</div>
								)}
							</>
						) : (
							<motion.div whileTap={{ scale: 0.98 }}>
								<Button
									disabled={disabled || isLoading}
									onClick={(e) => {
										e.stopPropagation();
										if (disabled) return;
										onPlanChange({
											slug: plan.slug,
										});
									}}
									className={`w-full ${
										plan.popular
											? `bg-linear-to-r ${plan.gradient} hover:opacity-90`
											: "bg-white/5 hover:bg-white/10 border border-white/20"
									} text-white font-semibold py-6 rounded-xl transition-all duration-300 ${
										isActive ? "shadow-lg shadow-purple-500/20" : ""
									} ${isLoading ? "opacity-80 animate-pulse" : ""}`}
								>
									<span className="inline-flex items-center">
										{buttonText}
										{!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
										{isLoading && (
											<Loader2 className="w-5 h-5 ml-2 animate-spin" />
										)}
									</span>
								</Button>
							</motion.div>
						)}
					</div>

					{/* Features */}
					<div className="space-y-4">
						{plan.features.map((feature, i) => (
							<motion.div
								key={feature}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 + i * 0.05 }}
								className="flex items-start gap-3"
							>
								<div
									className={`p-1 rounded-full bg-linear-to-br ${
										isCurrentPlan
											? "from-green-600 to-emerald-600"
											: plan.gradient
									} bg-opacity-20 shrink-0 mt-0.5`}
								>
									<Check className="w-4 h-4 text-white" />
								</div>
								<span className="text-gray-300">{feature}</span>
							</motion.div>
						))}
					</div>
				</div>
				{disabled && !isActive && (
					<div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
				)}
				{isActive && isLoading && (
					<div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
						<Loader2 className="w-6 h-6 text-white animate-spin" />
					</div>
				)}
			</Card>
		</motion.div>
	);
}
