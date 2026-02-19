import { Check, FileVideo, Film, Music } from "lucide-react";

interface MediaFormHeaderProps {
	isEditMode: boolean;
	isBulkMode?: boolean;
}

export function MediaFormHeader({
	isEditMode,
	isBulkMode = false,
}: MediaFormHeaderProps) {
	return (
		<div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-950/30 via-slate-900/50 to-purple-950/30 border-b border-white/10">
			<div className="flex items-start justify-between">
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
							{isBulkMode ? (
								<Check className="h-6 w-6 text-primary" />
							) : (
								<Film className="h-6 w-6 text-primary" />
							)}
						</div>
						<div>
							<h1 className="text-2xl font-black text-white">
								{isBulkMode
									? "Bulk Media Upload"
									: isEditMode
										? "Edit Media"
										: "Add New Media"}
							</h1>
							<p className="text-xs text-slate-400 font-medium">
								{isBulkMode
									? "Upload multiple media items at once"
									: isEditMode
										? "Update media information and metadata"
										: "Create a new media entry for your platform"}
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
						<FileVideo className="h-3.5 w-3.5 text-blue-400" />
						<span className="text-[10px] font-black uppercase text-blue-400">
							Movies
						</span>
					</div>
					<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
						<Music className="h-3.5 w-3.5 text-purple-400" />
						<span className="text-[10px] font-black uppercase text-purple-400">
							Tracks
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
