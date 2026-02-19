import { useStore } from "@tanstack/react-store";
import { Music, Plus } from "lucide-react";
import { useState } from "react";
import { AppDialog } from "@/components/app-dialog";
import { musicAction, musicStore } from "../music.store";
import { CreatePlaylistDialog } from "./create-playlist";

interface AddToPlaylistModalProps {
	trigger?: React.ReactNode;
}

export function AddToPlaylistModal(props: AddToPlaylistModalProps) {
	const { trigger } = props;
	const { library, isAddModalOpen, songToAddToPlaylist } = useStore(musicStore);
	const playlists = library.filter((i) => i.type === "playlist");
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<AppDialog
			open={isAddModalOpen}
			onOpenChange={(open) => {
				if (!open) musicAction.toggleAddToPlayListModal();
			}}
			component="drawer"
			trigger={
				trigger || (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							musicAction.toggleAddToPlayListModal();
						}}
						className="py-1.5 px-2 rounded-full border border-white/20 hover:bg-white/10  text-gray-400 hover:text-white transition-colors"
					>
						<Plus className="w-6 h-7" />
					</button>
				)
			}
			title="Add to Playlist"
			description="Choose a playlist to add this song to"
		>
			<div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
				{/* Create New Playlist Action */}
				<button
					type="button"
					onClick={() => {
						setIsCreateOpen(true);
					}}
					className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left group"
				>
					<div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
						<Plus className="w-6 h-6 text-white" />
					</div>
					<span className="text-white font-semibold">Create New Playlist</span>
				</button>

				<CreatePlaylistDialog
					isOpen={isCreateOpen}
					onClose={() => setIsCreateOpen(false)}
				/>
				{/* Playlist List */}
				{playlists.map((playlist) => (
					<button
						type="button"
						key={playlist.id}
						onClick={() => {
							musicAction.addSongToPlaylistAction(
								playlist.id,
								songToAddToPlaylist,
							);
							musicAction.toggleAddToPlayListModal();
						}}
						className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
					>
						<div className="w-12 h-12 rounded bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shrink-0">
							<Music className="w-6 h-6 text-white" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-white font-medium truncate">
								{playlist.title}
							</div>
							<div className="text-sm text-gray-400 truncate">
								{playlist.subtitle}
							</div>
						</div>
					</button>
				))}
			</div>
		</AppDialog>
	);
}
