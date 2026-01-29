import { AnimatePresence, motion } from "framer-motion";
import { Music, Plus, X } from "lucide-react";
import type { LibraryItem } from "../music.store";

interface AddToPlaylistModalProps {
	isOpen: boolean;
	onClose: () => void;
	playlists: LibraryItem[];
	onAddToPlaylist: (playlistId: string) => void;
	onCreateNew: () => void;
}

export function AddToPlaylistModal({
	isOpen,
	onClose,
	playlists,
	onAddToPlaylist,
	onCreateNew,
}: AddToPlaylistModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1a1a1a] rounded-xl shadow-2xl z-50 p-6"
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-white">Add to Playlist</h2>
							<button
								type="button"
								onClick={onClose}
								className="text-gray-400 hover:text-white transition-colors"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						<div className="space-y-2 max-h-96 overflow-y-auto mb-4 custom-scrollbar">
							<button
								type="button"
								onClick={() => {
									onCreateNew();
									onClose();
								}}
								className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left group"
							>
								<div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center group-hover:bg-white/20">
									<Plus className="w-6 h-6 text-white" />
								</div>
								<span className="text-white font-semibold">
									Create New Playlist
								</span>
							</button>

							{playlists.map((playlist) => (
								<button
									type="button"
									key={playlist.id}
									onClick={() => {
										onAddToPlaylist(playlist.id);
										onClose();
									}}
									className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
								>
									<div className="w-12 h-12 rounded bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
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
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
