import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PlanType } from "../data";

interface PlanCardProps {
	plan: PlanType;
	index: number;
	isAnnual: boolean;
}

export function PlanCard(props: PlanCardProps) {
	const { plan, index, isAnnual } = props;

	return (
		<motion.div
			key={plan.name}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1, duration: 0.6 }}
			className="relative"
		>
			{plan.popular && (
				<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
					<Badge className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1.5">
						Most Popular
					</Badge>
				</div>
			)}

			<Card
				className={`relative overflow-hidden bg-white/3 backdrop-blur-xl border border-white/10 p-8 h-full  transition-all duration-300 hover:bg-white/5 hover:border-white/20 ${
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
					<h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
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
								${(plan.price.annual / 12).toFixed(2)}/month billed annually
							</p>
						)}
					</div>

					{/* CTA Button */}
					<Button
						className={`w-full mb-8 ${
							plan.popular
								? `bg-linear-to-r ${plan.gradient} hover:opacity-90`
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
								key={feature}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 + i * 0.05 }}
								className="flex items-start gap-3"
							>
								<div
									className={`p-1 rounded-full bg-linear-to-br ${plan.gradient} bg-opacity-20 shrink-0 mt-0.5`}
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
	);
}
