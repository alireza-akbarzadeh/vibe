import { cn } from "@/lib/utils";
import { Link, type ValidLink } from "../ui/link";

type MenuItemProps = {
	to: ValidLink;
	icon: React.ElementType;
	label: string;
	description?: string;
	highlight?: boolean;
	onClick?: () => void;
};

export function MenuItem(props: MenuItemProps) {
	const { to, icon: Icon, label, description, highlight, onClick } = props;

	return (
		<Link
			onClick={onClick}
			to={to}
			className={cn(
				"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all group",
				highlight
					? "bg-linear-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/20"
					: "text-slate-300 hover:bg-white/5",
			)}
		>
			<div
				className={cn(
					"rounded-lg p-1.5",
					highlight ? "bg-indigo-500/20" : "bg-white/5 group-hover:bg-white/10",
				)}
			>
				<Icon className="size-4" />
			</div>
			<div className="flex-1 text-left">
				<p className="font-medium">{label}</p>
				{description && <p className="text-xs text-slate-500">{description}</p>}
			</div>
		</Link>
	);
}
