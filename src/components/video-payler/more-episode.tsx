import { CheckCircle2, Clock, Layers, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

// Mock Data with more detail
const SERIES_DATA = [
	{
		season: 1,
		episodes: [
			{
				id: 1,
				title: "The Beginning",
				duration: "45m",
				thumb:
					"https://images.unsplash.com/photo-1618172193622-ae2d025f4128?w=200&h=120&fit=crop",
				progress: 100,
			},
			{
				id: 2,
				title: "The Dark Knight",
				duration: "42m",
				thumb:
					"https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&h=120&fit=crop",
				progress: 40,
			},
			{
				id: 3,
				title: "Into the Abyss",
				duration: "50m",
				thumb:
					"https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=200&h=120&fit=crop",
				progress: 0,
			},
		],
	},
];

export function MoreEpisode() {
	const [selectedSeason, setSelectedSeason] = useState("1");

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="text-white hover:bg-white/10 h-10 w-10"
				>
					<Layers className="size-5" />
				</Button>
			</SheetTrigger>

			<SheetContent
				side="right"
				className="w-full sm:max-w-md bg-zinc-950 border-zinc-800 p-0 flex flex-col text-white"
			>
				<SheetHeader className="p-6 border-b border-zinc-800 mt-10">
					<div className="flex items-center justify-between">
						<SheetTitle className="text-white text-xl font-bold">
							Episodes
						</SheetTitle>
						<Select value={selectedSeason} onValueChange={setSelectedSeason}>
							<SelectTrigger className="w-32 bg-zinc-900 border-zinc-700 text-white">
								<SelectValue placeholder="Season" />
							</SelectTrigger>
							<SelectContent className="bg-zinc-900 border-zinc-700 text-white">
								<SelectItem value="1">Season 1</SelectItem>
								<SelectItem value="2">Season 2</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</SheetHeader>

				<ScrollArea className="flex-1 p-4">
					<div className="space-y-4">
						{SERIES_DATA[0].episodes.map((ep) => (
							<button
								type="button"
								key={ep.id}
								className="group w-full flex gap-4 p-2 rounded-xl transition-colors hover:bg-white/5 text-left items-center"
							>
								{/* Thumbnail Area */}
								<div className="relative shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-zinc-800">
									<img
										src={ep.thumb}
										className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
										alt={ep.title}
									/>
									<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
										<Play className="fill-white text-white size-6" />
									</div>

									{/* Small Progress Bar on Thumb */}
									{ep.progress > 0 && (
										<div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
											<div
												className="h-full bg-purple-500"
												style={{ width: `${ep.progress}%` }}
											/>
										</div>
									)}
								</div>

								{/* Content Area */}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<span className="text-xs font-bold text-purple-400">
											EPISODE {ep.id}
										</span>
										{ep.progress === 100 && (
											<CheckCircle2 className="size-3 text-emerald-500" />
										)}
									</div>
									<h4 className="text-sm font-medium text-zinc-100 truncate group-hover:text-white">
										{ep.title}
									</h4>
									<div className="flex items-center gap-2 mt-1 text-zinc-500 text-xs">
										<Clock className="size-3" />
										{ep.duration}
									</div>
								</div>
							</button>
						))}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
