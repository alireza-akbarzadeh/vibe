import { motion } from "framer-motion";

export function FeatureCard({
	icon,
	title,
	description,
	delay,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	delay: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.5 }}
			whileHover={{ y: -4 }}
			className="bg-card border border-border rounded-2xl p-8 group transition-colors hover:border-accent/50"
		>
			<div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
				{icon}
			</div>
			<h3 className="text-xl font-semibold mb-3">{title}</h3>
			<p className="text-muted-foreground leading-relaxed">{description}</p>
		</motion.div>
	);
}
