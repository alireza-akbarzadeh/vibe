import type { ReactNode } from "react";
import type { Variants } from "@/components/motion";
import { motion } from "@/components/motion";

interface AnimatedPageProps {
	children: ReactNode;
	className?: string;
}

const pageVariants: Variants = {
	initial: {
		opacity: 0,
		y: 20,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: "easeOut",
		},
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: {
			duration: 0.3,
		},
	},
};

export const MotionPage = ({ children, className = "" }: AnimatedPageProps) => {
	return (
		<motion.div
			initial="initial"
			animate="animate"
			exit="exit"
			variants={pageVariants}
			className={className}
		>
			{children}
		</motion.div>
	);
};

export const staggerContainer = {
	initial: {},
	animate: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

export const fadeInUp: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: "easeOut",
		},
	},
};

export const scaleIn: Variants = {
	initial: { opacity: 0, scale: 0.9 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.3,
			ease: "easeOut",
		},
	},
};
