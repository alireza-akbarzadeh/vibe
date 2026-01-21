import { Outlet } from "@tanstack/react-router";
import { ScrollRestoration } from "@/components/scroll-top";
import { usePersistentScroll } from "@/hooks/usePersistentScroll";

export function RouteComponent() {
    usePersistentScroll();

    return (
        <ScrollRestoration>
            <Outlet />
        </ScrollRestoration>
    );
}
