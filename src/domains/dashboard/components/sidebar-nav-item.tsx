import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ICON_MAP, type SidebarItem } from "@/config/admin-sidebar";
import { cn } from "@/lib/utils";

export function SidebarNavItem({
	item,
	isCollapsed,
	pathname,
}: {
	item: SidebarItem;
	isCollapsed: boolean;
	pathname: string;
}) {
	const hasChildren = !!(item.children && item.children.length > 0);
	const isChildActive =
		hasChildren &&
		item.children?.some((c) => pathname.startsWith(c.href || ""));
	const [isOpen, setIsOpen] = useState(!!isChildActive);

	useEffect(() => {
		if (isChildActive) setIsOpen(true);
	}, [isChildActive]);

	const isActive = pathname === item.href || isChildActive;

	const itemClasses = cn(
		"group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 outline-none mb-1",
		isActive
			? "bg-secondary/80 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-border/50"
			: "text-muted-foreground hover:bg-accent/40 hover:text-foreground border border-transparent",
		isCollapsed && "justify-center p-0 h-10 w-10 mx-auto rounded-xl",
	);

	const renderIcon = (iconName?: string, active?: boolean) => {
		const IconComponent = iconName ? ICON_MAP[iconName] : null;
		return (
			<div
				className={cn(
					"flex items-center justify-center shrink-0 transition-colors duration-200",
					active
						? "text-primary"
						: "text-muted-foreground group-hover:text-foreground",
				)}
			>
				{IconComponent ? (
					<IconComponent size={20} strokeWidth={active ? 2.5 : 2} />
				) : (
					<div
						className={cn(
							"h-1.5 w-1.5 rounded-full bg-current transition-all",
							active ? "scale-125" : "opacity-30",
						)}
					/>
				)}
			</div>
		);
	};

	// --- CASE 1: COLLAPSED WITH CHILDREN (Opens Menu on Click) ---
	if (isCollapsed && hasChildren) {
		return (
			<DropdownMenu>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<button
								className={cn(
									itemClasses,
									"cursor-pointer outline-none overflow-visible",
								)}
							>
								{renderIcon(item.icon, isActive)}
								{isChildActive && (
									<div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary border-2 border-background" />
								)}
							</button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					{/* Standard Tooltip shows only the Title on Hover */}
					<TooltipContent
						side="right"
						sideOffset={12}
						className="text-xs font-bold z-50"
					>
						{item.label}
					</TooltipContent>
				</Tooltip>

				{/* Dropdown Content Portals automatically to Body in Shadcn */}
				<DropdownMenuContent
					side="right"
					sideOffset={15}
					className="w-56 p-2 bg-popover/95 backdrop-blur-md shadow-2xl border-border/50 rounded-xl z-[100]"
				>
					<DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
						{item.label}
					</DropdownMenuLabel>
					<DropdownMenuSeparator className="opacity-50" />
					<div className="mt-1 space-y-0.5">
						{item.children?.map((child) => (
							<DropdownMenuItem key={child.href} asChild>
								<Link
									to={child.href}
									className={cn(
										"flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer outline-none",
										pathname === child.href
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:text-foreground hover:bg-accent",
									)}
								>
									{child.label}
									{pathname === child.href && (
										<div className="h-1 w-1 rounded-full bg-primary" />
									)}
								</Link>
							</DropdownMenuItem>
						))}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	// --- CASE 2: EXPANDED WITH CHILDREN (Collapsible) ---
	if (hasChildren && !isCollapsed) {
		return (
			<Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
				<CollapsibleTrigger asChild>
					<button
						className={cn(itemClasses, "w-full justify-between cursor-pointer")}
					>
						<div className="flex items-center gap-3">
							{renderIcon(item.icon, isActive)}
							<span
								className={cn(
									"transition-colors",
									isActive ? "font-semibold" : "font-medium",
								)}
							>
								{item.label}
							</span>
						</div>
						<ChevronDown
							className={cn(
								"h-3.5 w-3.5 transition-transform duration-300 opacity-40",
								isOpen && "rotate-180 opacity-100 text-primary",
							)}
						/>
					</button>
				</CollapsibleTrigger>
				<CollapsibleContent className="ml-[22px] mt-1 border-l border-border/60 pl-4 space-y-0.5">
					{item.children?.map((child) => {
						const isChildLinkActive = pathname === child.href;
						return (
							<Link
								key={child.href}
								to={child.href}
								className={cn(
									"block rounded-lg px-3 py-2 text-xs transition-all relative",
									isChildLinkActive
										? "text-foreground font-bold bg-accent/50 shadow-sm"
										: "text-muted-foreground hover:text-foreground hover:bg-accent/30",
								)}
							>
								{isChildLinkActive && (
									<div className="absolute left-[-17px] top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
								)}
								{child.label}
							</Link>
						);
					})}
				</CollapsibleContent>
			</Collapsible>
		);
	}

	// --- CASE 3: SINGLE ITEM (No Children) ---
	return (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<Link to={item.href || "#"} className={cn(itemClasses)}>
					{renderIcon(item.icon, isActive)}
					{!isCollapsed && (
						<span className="flex-1 truncate">{item.label}</span>
					)}
					{isActive && isCollapsed && (
						<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
					)}
				</Link>
			</TooltipTrigger>
			{isCollapsed && (
				<TooltipContent
					side="right"
					sideOffset={10}
					className="bg-popover border-border px-3 py-1.5 text-xs font-bold shadow-xl z-50"
				>
					{item.label}
				</TooltipContent>
			)}
		</Tooltip>
	);
}
