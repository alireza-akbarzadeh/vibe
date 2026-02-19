import { ArrowLeft, UserCog, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";

interface UserFormHeaderProps {
	isEditMode: boolean;
}

export default function UserFormHeader(props: UserFormHeaderProps) {
	const { isEditMode } = props;
	return (
		<div className="relative  space-y-6 px-6 pt-8">
			{/* Breadcrumb / Back Link - Clean and minimal */}
			<div className="flex items-center gap-2 group">
				<Link
					to="/dashboard/users"
					className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
				>
					<ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
					Registry Index
				</Link>
			</div>

			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						{/* Visual Indicator for Mode */}
						<div
							className={cn(
								"h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
								isEditMode
									? "bg-amber-500/10 text-amber-600"
									: "bg-primary/10 text-primary",
							)}
						>
							{isEditMode ? (
								<UserCog className="h-6 w-6" />
							) : (
								<UserPlus className="h-6 w-6" />
							)}
						</div>

						<div className="space-y-1">
							<h1 className="text-4xl font-black tracking-tighter leading-none italic">
								{isEditMode ? "Modify Account" : "Deploy Identity"}
							</h1>
							<div className="flex items-center gap-2">
								<Badge
									variant="outline"
									className={cn(
										"h-5 px-2 text-[9px] font-black uppercase tracking-widest border-none",
										isEditMode
											? "bg-amber-100 text-amber-700"
											: "bg-emerald-100 text-emerald-700",
									)}
								>
									{isEditMode ? "Protocol: Edit" : "Protocol: Create"}
								</Badge>
								<span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
								<p className="text-xs font-medium text-muted-foreground">
									{isEditMode
										? "Synchronizing system-wide permissions"
										: "Registering new entity node"}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Floating Metrics / Info in Header */}
				<div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/40 backdrop-blur-sm">
					<div className="px-4 border-r border-border/60">
						<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
							Status
						</p>
						<div className="flex items-center gap-1.5">
							<div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
							<span className="text-[10px] font-bold uppercase">
								System Live
							</span>
						</div>
					</div>
					<div className="px-4">
						<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
							Server Time
						</p>
						<span className="text-[10px] font-bold uppercase tabular-nums">
							{new Date().toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}{" "}
							UTC
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
