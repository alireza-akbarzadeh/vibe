import { useRouter } from "@tanstack/react-router";
import { useLayoutEffect, useRef } from "react";

const scrollPositions = new Map<string, number>();

type NavAction = "PUSH" | "REPLACE" | "BACK" | "FORWARD" | "GO";

export function ScrollRestoration({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const lastAction = useRef<NavAction>("PUSH");
    const prevLocation = useRef(router.state.location);

    // Subscribe to history changes
    useLayoutEffect(() => {
        if (typeof window === "undefined") return;

        const unsubscribe = router.history.subscribe((state) => {
            const { location, action } = state;

            // Save scroll of previous page
            scrollPositions.set(prevLocation.current.href, window.scrollY);

            // Restore scroll
            if (action.type === "BACK" || action.type === "FORWARD") {
                const y = scrollPositions.get(location.href) ?? 0;
                window.scrollTo({ top: y, left: 0, behavior: "instant" });
            } else {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            }
            //@ts-ignore
            prevLocation.current = location;
            lastAction.current = action.type;
        });

        return () => unsubscribe();
    }, [router.history]);

    return <>{children}</>;
}
