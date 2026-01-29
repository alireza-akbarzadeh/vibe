interface LibraryButtonProps {
	icon: React.ComponentType<{
		size: number;
		className?: string;
		fill?: string;
	}>;
	label: string;
	count: number;
	color: string;
	active?: boolean;
	onClick: () => void;
}

export function LibraryButton({
	icon: Icon,
	label,
	count,
	color,
	active,
	onClick,
}: LibraryButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${active ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-200 hover:bg-white/5"}`}
		>
			<div className="flex items-center gap-3">
				<Icon
					size={18}
					className={count > 0 ? color : ""}
					fill={active && count > 0 ? "currentColor" : "none"}
				/>
				<span className="text-sm font-semibold">{label}</span>
			</div>
			{count > 0 && (
				<span
					className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? "bg-white/20" : "bg-white/5"}`}
				>
					{count}
				</span>
			)}
		</button>
	);
}
