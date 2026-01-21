import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

export function usePersistentScroll() {
	const location = useLocation();

	useEffect(() => {
		const path = location.pathname;

		// Restore scroll on mount
		const restoreScroll = () => {
			const savedY = sessionStorage.getItem(`scrollY-${path}`);
			setTimeout(() => {
				if (savedY) window.scrollTo(0, Number(savedY));
				else window.scrollTo(0, 0);
			}, 0);
		};
		restoreScroll();

		// Save scroll
		let timeout: NodeJS.Timeout;
		const handleScroll = () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				sessionStorage.setItem(`scrollY-${path}`, String(window.scrollY));
			}, 100);
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("popstate", restoreScroll); // ← handles back/forward

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("popstate", restoreScroll);
		};
	}, [location.pathname]);
}
