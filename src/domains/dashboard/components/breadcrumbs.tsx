import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { useMemo } from "react";
import { dashboard_SIDEBAR } from "@/config/admin-sidebar";

export function DashboardBreadcrumbs({ pathname }: { pathname: string }) {
	const breadcrumbs = useMemo(() => {
		const paths = pathname.split("/").filter(Boolean);
		let currentPath = "";

		return paths.map((segment, index) => {
			currentPath += `/${segment}`;

			// Look for the label in our sidebar config
			let label =
				segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

			dashboard_SIDEBAR.forEach((group) => {
				group.items.forEach((item) => {
					if (item.href === currentPath) label = item.label;
					item.children?.forEach((child) => {
						if (child.href === currentPath) label = child.label;
					});
				});
			});

			return {
				label,
				href: currentPath,
				isLast: index === paths.length - 1,
			};
		});
	}, [pathname]);

	if (breadcrumbs.length <= 1) return null;

	return (
		<nav className="hidden lg:flex items-center gap-2 text-sm">
			<Link
				to="/dashboard"
				className="text-muted-foreground hover:text-primary transition-colors"
			>
				<Home size={15} />
			</Link>

			{breadcrumbs.map((crumb) => (
				<div key={crumb.href} className="flex items-center gap-2">
					<ChevronRight size={14} className="text-muted-foreground/50" />
					{crumb.isLast ? (
						<span className="font-semibold text-foreground tracking-tight">
							{crumb.label}
						</span>
					) : (
						<Link
							to={crumb.href}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							{crumb.label}
						</Link>
					)}
				</div>
			))}
		</nav>
	);
}
