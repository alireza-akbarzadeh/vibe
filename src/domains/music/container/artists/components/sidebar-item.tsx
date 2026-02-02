import { useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Ban,
	Flag,
	FolderPlus,
	ListPlus,
	MoveRight,
	Pin,
	PlusCircle,
	Share2,
	Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { musicAction } from "@/domains/music/music.store";


interface LibraryItem {
	id: string | number;
	title: string;
	subtitle: string;
	image: string;
	type: "artist" | "playlist" | "album";
	isPinned?: boolean;
}

interface SidebarItemProps {
	item: LibraryItem;
	onOpenCreate: () => void;
}

export function SidebarItem({ item, onOpenCreate }: SidebarItemProps) {
	const navigate = useNavigate();
	const location = useLocation();

	// Check if the current route matches this item's ID
	const isActive = location.pathname === `/music/${item.id}`;

	const handlePin = () => {
		musicAction.togglePin(item.id);
		toast.success(
			item.isPinned ? "Unpinned from Library" : "Pinned to Library",
			{
				description: item.title,
				icon: <Pin className="w-4 h-4" />,
			},
		);
	};

	const handleRemove = () => {
		musicAction.removeFromLibrary(item.id);
		toast.error("Removed from Library", {
			description: `${item.title} has been removed.`,
		});
	};

	const handleShare = (type: "link" | "embed") => {
		const text =
			type === "link" ? "Link copied to clipboard" : "Embed code copied";
		navigator.clipboard.writeText(window.location.href);
		toast.success(text);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<motion.div
					layout
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95 }}
					whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
					className={`flex items-center gap-3 p-2 rounded-md cursor-pointer group transition-colors relative ${isActive ? "bg-white/10" : ""
						}`}
					onClick={() => navigate({ to: `/music/${item.id}` })}
				>
					<div className="relative">
						<img
							alt={item.title}
							src={item.image}
							className={`w-12 h-12 object-cover transition-transform duration-300 ${isActive ? "scale-90" : "scale-100"
								} ${item.type === "artist" ? "rounded-full" : "rounded-md shadow-lg"}`}
						/>
						{/* Active indicator dot/bar */}
						{isActive && (
							<div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full" />
						)}
					</div>

					<div className="flex-1 min-w-0">
						<h4
							className={`text-sm font-medium truncate transition-colors ${isActive ? "text-pink-400" : "text-white"
								}`}
						>
							{item.title}
						</h4>
						<p className="text-xs text-gray-400 truncate flex items-center gap-1.5">
							{item.isPinned && (
								<Pin className="w-3 h-3 text-purple-500 fill-purple-500 rotate-45" />
							)}
							<span className={isActive ? "text-purple-300/80" : ""}>
								{item.subtitle}
							</span>
						</p>
					</div>
				</motion.div>
			</ContextMenuTrigger>

			{/* Context Menu Content */}
			<ContextMenuContent className="w-64 bg-[#282828] border-[#3e3e3e] text-[#e0e0e0] shadow-xl">
				<ContextMenuItem className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer">
					<ListPlus className="w-4 h-4 text-gray-400" />
					<span>Add to queue</span>
				</ContextMenuItem>

				<ContextMenuSeparator className="bg-[#3e3e3e]" />

				<ContextMenuItem className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer">
					<Flag className="w-4 h-4 text-gray-400" />
					<span>Report</span>
				</ContextMenuItem>

				<ContextMenuItem
					onClick={handleRemove}
					className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer text-red-400"
				>
					<Trash2 className="w-4 h-4" />
					<span className="text-white">Remove from Your Library</span>
				</ContextMenuItem>

				<ContextMenuSeparator className="bg-[#3e3e3e]" />

				<ContextMenuItem
					onClick={(e) => {
						e.stopPropagation();
						onOpenCreate();
					}}
					className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer"
				>
					<PlusCircle className="w-4 h-4 text-gray-400" />
					<span>Create playlist</span>
				</ContextMenuItem>

				<ContextMenuItem className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer">
					<FolderPlus className="w-4 h-4 text-gray-400" />
					<span>Create folder</span>
				</ContextMenuItem>

				<ContextMenuItem className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer">
					<Ban className="w-4 h-4 text-gray-400" />
					<span>Exclude from your taste profile</span>
				</ContextMenuItem>

				<ContextMenuSub>
					<ContextMenuSubTrigger className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer">
						<MoveRight className="w-4 h-4 text-gray-400" />
						<span>Move to folder</span>
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className="bg-[#282828] border-[#3e3e3e] text-white">
						<ContextMenuItem>Your Folder 1</ContextMenuItem>
						<ContextMenuItem>Your Folder 2</ContextMenuItem>
					</ContextMenuSubContent>
				</ContextMenuSub>

				<ContextMenuItem
					onClick={handlePin}
					className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer"
				>
					<Pin
						className={`w-4 h-4 ${item.isPinned ? "text-purple-500 fill-purple-500" : "text-gray-400"}`}
					/>
					<span>{item.isPinned ? "Unpin playlist" : "Pin playlist"}</span>
				</ContextMenuItem>

				<ContextMenuSub>
					<ContextMenuSubTrigger className="gap-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer">
						<Share2 className="w-4 h-4 text-gray-400" />
						<span>Share</span>
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className="bg-[#282828] border-[#3e3e3e] text-white">
						<ContextMenuItem onClick={() => handleShare("link")}>
							Copy Playlist Link
						</ContextMenuItem>
						<ContextMenuItem onClick={() => handleShare("embed")}>
							Embed Playlist
						</ContextMenuItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
			</ContextMenuContent>
		</ContextMenu>
	);
}
