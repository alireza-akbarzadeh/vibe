import { motion } from "framer-motion";
import { Crown, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { CheckoutInputScheme } from "@/types/subscription";
import { FaqSection } from "./components/faq-section";
import { PlanCard } from "./components/plans-card";
import type { PlanType } from "./plans.constants";

interface PlansProps {
	onCheckout: (plan: CheckoutInputScheme) => void;
	plans: PlanType[];
}

export const iconMap = {
	Sparkles,
	Zap,
	Crown,
};
type PlanWithIcon = Omit<PlanType, "icon"> & {
	icon: typeof iconMap[keyof typeof iconMap];
};

export function Plans(props: PlansProps) {
	const { onCheckout, plans } = props
	const [isAnnual, setIsAnnual] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let rafId: number;
		const handleMouseMove = (e: MouseEvent) => {
			// Use requestAnimationFrame to throttle updates
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				setMousePosition({
					x: (e.clientX / window.innerWidth - 0.5) * 20,
					y: (e.clientY / window.innerHeight - 0.5) * 20,
				});
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, []);

	// Memoize the icon mapping to prevent recalculating on every render
	const data: PlanWithIcon[] = useMemo(
		() =>
			plans?.map((plan) => ({
				...plan,
				icon: iconMap[plan.icon as keyof typeof iconMap],
			})) ?? [],
		[plans]
	);


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
					<Badge className="bg-linear-to-r py-3 from-purple-600/20 to-pink-600/20 text-white border-purple-500/30 mb-6">
						Pricing Plans
					</Badge>

					<h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
						Choose Your{" "}
						<span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
							Perfect Plan
						</span>
					</h1>

					<p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
						Unlimited entertainment for everyone. Start with a 7-day free trial,
						cancel anytime.
					</p>

					{/* Toggle */}
					<div className="inline-flex items-center gap-4 p-2 rounded-full bg-white/3 backdrop-blur-xl border border-white/10">
						<button
							type="button"
							onClick={() => setIsAnnual(false)}
							className={`px-6 py-2 rounded-full font-medium transition-all ${!isAnnual
								? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
								: "text-gray-400 hover:text-white"
								}`}
						>
							Monthly
						</button>
						<button
							type="button"
							onClick={() => setIsAnnual(true)}
							className={`px-6 py-2 rounded-full font-medium transition-all ${isAnnual
								? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
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
					{data.map((plan, index) => (
						<PlanCard
							key={plan.slug}
							plan={plan}
							onPlanChange={async (data) => {
								if (isLoading) return;
								setActiveIndex(index);
								setIsLoading(true);
								try {
									await onCheckout(data);
								} finally {
									setIsLoading(false);
								}
							}}
							index={index}
							isAnnual={isAnnual}
							isActive={activeIndex === index}
							isLoading={isLoading && activeIndex === index}
							disabled={isLoading && activeIndex !== index}
						/>
					))}
				</div>
				<FaqSection />
			</div>
		</div>
	);
}
