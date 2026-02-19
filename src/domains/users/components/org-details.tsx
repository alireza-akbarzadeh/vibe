interface OrgDetailsProps {
	organization?: string;
	manager?: string;
}

export function OrgDetails({ organization, manager }: OrgDetailsProps) {
	return (
		<div className="px-2 py-1 space-y-2">
			<div className="flex flex-col gap-0.5">
				<span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">
					Organization
				</span>
				<span className="text-xs font-semibold text-foreground truncate">
					{organization || "Independent"}
				</span>
			</div>
			<div className="flex flex-col gap-0.5">
				<span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">
					Reporting Manager
				</span>
				<span className="text-xs font-semibold text-foreground truncate">
					{manager || "Not Assigned"}
				</span>
			</div>
		</div>
	);
}
