import { useHotkeys } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { actions } from "../store/dashboard.store";

export function useDashboardShortcuts() {
	const navigate = useNavigate();

	useHotkeys([
		[
			"mod+K",
			(e) => {
				e.preventDefault();
				actions.setSearchOpen(true);
			},
		],

		[
			"alt+N",
			(e) => {
				e.preventDefault();
				actions.setNotificationOpen(true);
			},
		],

		["g+d", () => navigate({ to: "/dashboard" })],
		["g+m", () => navigate({ to: "/dashboard/movies" })],
		["g+u", () => navigate({ to: "/dashboard/users" })],
		["g+s", () => navigate({ to: "/dashboard/settings" })],

		[
			"esc",
			() => {
				actions.setSearchOpen(false);
				actions.setNotificationOpen(false);
				actions.setMobileSidebarOpen(false);
			},
		],
	]);
}
