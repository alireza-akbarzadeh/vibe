import { lazy } from "react";

export {
	motion,
	useAnimation,
	useMotionValue,
	useMotionValueEvent,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";

export const AnimatePresence = lazy(() =>
	import("framer-motion").then((m) => ({ default: m.AnimatePresence })),
);

export const LayoutGroup = lazy(() =>
	import("framer-motion").then((m) => ({ default: m.LayoutGroup })),
);
