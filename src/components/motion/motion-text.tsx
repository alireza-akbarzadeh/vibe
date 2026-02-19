import { motion } from "@/components/motion";
export function MotionText({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	return (
		<span className={className}>
			{text.split("").map((char, i) => (
				<motion.span
					// biome-ignore lint/suspicious/noArrayIndexKey: The index is used as a key for a list of characters, which is stable.
					key={i}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.4,
						delay: i * 0.03,
						ease: [0.16, 1, 0.3, 1],
					}}
					className="inline-block"
				>
					{char === " " ? "\u00A0" : char}
				</motion.span>
			))}
		</span>
	);
}
