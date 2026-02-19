import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { FileText, Settings, User } from "lucide-react";
import { useMemo } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { ICON_MAP, type SidebarGroup } from "@/config/admin-sidebar";
import { actions, dashboardStore } from "../store/dashboard.store";

type IconMapType = Record<string, React.ComponentType<{ className?: string }>>;

interface CommandSettingProps {
	data: SidebarGroup[];
}

export type FlatSearchItem = {
	label: string;
	href: string;
	icon?: string;
	groupName: string;
	parentLabel: string | null;
	permission?: string;
};

export function SearchSide({ data }: CommandSettingProps) {
	const navigate = useNavigate();

	// Subscribe to TanStack Store
	const searchOpen = useStore(dashboardStore, (state) => state.searchOpen);

	const flatItems = useMemo(() => {
		const items: FlatSearchItem[] = [];
		data.forEach((group) => {
			group.items.forEach((item) => {
				if (item.href) {
					items.push({
						label: item.label,
						href: item.href,
						icon: item.icon,
						groupName: group.group,
						parentLabel: null,
						permission: item.permission,
					});
				}
				if (item.children) {
					item.children.forEach((child) => {
						if (child.href) {
							items.push({
								label: child.label,
								href: child.href,
								icon: child.icon || item.icon,
								groupName: group.group,
								parentLabel: item.label,
								permission: child.permission || item.permission,
							});
						}
					});
				}
			});
		});
		return items;
	}, [data]);

	const onSelect = (href: string) => {
		actions.setSearchOpen(false);
		navigate({ to: href });
	};

	return (
		<CommandDialog open={searchOpen} onOpenChange={actions.setSearchOpen}>
			<CommandInput placeholder="Search pages, tools, or staff settings..." />
			<CommandList className="custom-scrollbar">
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Navigation">
					{flatItems.map((item, index) => {
						const Icon = item.icon
							? (ICON_MAP as IconMapType)[item.icon]
							: FileText;
						return (
							<CommandItem
								key={`${item.href}-${index}`}
								onSelect={() => item.href && onSelect(item.href)}
								className="flex items-center gap-3 py-3 cursor-pointer group"
							>
								<div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-muted/50 transition-colors group-aria-selected:bg-background">
									<Icon className="h-4 w-4 text-muted-foreground group-aria-selected:text-primary transition-colors" />
								</div>
								<div className="flex flex-col">
									<span className="font-semibold text-sm group-aria-selected:text-primary transition-colors">
										{item.label}
									</span>
									<div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
										<span>{item.groupName}</span>
										{item.parentLabel && (
											<>
												<span className="opacity-40">/</span>
												<span className="text-primary/70">
													{item.parentLabel}
												</span>
											</>
										)}
									</div>
								</div>
							</CommandItem>
						);
					})}
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Quick Actions">
					<CommandItem onSelect={() => onSelect("/dashboard/settings")}>
						<Settings className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">System Settings</span>
					</CommandItem>
					<CommandItem onSelect={() => onSelect("/dashboard/library")}>
						<User className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">My Profile</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
