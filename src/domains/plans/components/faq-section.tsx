import { motion } from "@/components/motion";
import { Card } from "@/components/ui/card";

export function FaqSection() {
	return (
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
				].map((faq) => (
					<Card
						key={faq.a}
						className="bg-white/3 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/5 transition-all"
					>
						<h3 className="text-white font-semibold mb-2">{faq.q}</h3>
						<p className="text-gray-400">{faq.a}</p>
					</Card>
				))}
			</div>
		</motion.div>
	);
}
