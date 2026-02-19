import { Check } from "lucide-react";
import { motion } from "@/components/motion";

type SocialSecurityCardProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
	features: string[];
	gradient: string;
	delay: number;
};

export function SocialSecurityCard({
	icon,
	title,
	description,
	features,
	gradient,
	delay,
}: SocialSecurityCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay }}
			className="group relative"
		>
			<div
				className={`absolute inset-0 bg-linear-to-br ${gradient} rounded-3xl blur-xl group-hover:blur-2xl transition-all`}
			/>
			<div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
				<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-6 text-purple-400">
					{icon}
				</div>
				<h3 className="text-3xl font-bold mb-4">{title}</h3>
				<p className="text-gray-400 text-lg mb-8 leading-relaxed">
					{description}
				</p>
				<div className="space-y-3">
					{features.map((feature) => (
						<div
							key={feature}
							className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
						>
							<Check className="w-5 h-5 text-purple-400 shrink-0" />
							<span className="text-sm">{feature}</span>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}
