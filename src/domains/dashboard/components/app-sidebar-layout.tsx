import { useQuery } from "@tanstack/react-query";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store"; // Added
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSidebarData } from "../server/dashboard.functions";
import { actions, dashboardStore } from "../store/dashboard.store";
import AppHeader from "./app-header";
import { SearchSide } from "./search-setting";
import { AdminSidebar } from "./sidebar";

export function AppSidebarLayout() {
	const _searchOpen = useStore(dashboardStore, (state) => state.searchOpen);
	const mobileOpen = useStore(
		dashboardStore,
		(state) => state.mobileSidebarOpen,
	);

	const pathname = useRouterState().location.pathname;
	const userRole = "admin";

	const { data: groups = [] } = useQuery({
		queryKey: ["sidebar", userRole],
		queryFn: () => getSidebarData({ data: userRole }),
		staleTime: 1000 * 60 * 10,
	});

	return (
		<TooltipProvider delayDuration={0}>
			<div className="flex h-screen w-full overflow-hidden bg-background">
				{/* Desktop Sidebar */}
				<AdminSidebar
					pathname={pathname}
					groups={groups}
					className="hidden md:flex"
				/>

				{/* Mobile Sidebar - Now controlled by Store */}
				<Sheet open={mobileOpen} onOpenChange={actions.setMobileSidebarOpen}>
					<SheetContent side="left" className="p-0 w-72 border-none">
						<AdminSidebar pathname={pathname} groups={groups} isMobile />
					</SheetContent>
				</Sheet>

				<div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
					<AppHeader pathname={pathname} />

					<main className="flex-1 overflow-y-auto bg-muted/20 scroll-smooth">
						{/* PREMIUM TIP: The "Container" here uses a subtle
                           fade-in motion for page transitions
                        */}
						<div className="container mx-auto p-4 md:p-8 max-w-[1600px] min-h-full">
							<Outlet />
						</div>
					</main>
				</div>

				<SearchSide data={groups} />
			</div>
		</TooltipProvider>
	);
}
