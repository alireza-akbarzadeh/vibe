import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreatePlaylistFormData {
	name: string;
	description: string;
}

interface CreatePlaylistDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onCreatePlaylist: (data: CreatePlaylistFormData) => void;
}

export function CreatePlaylistDialog({
	isOpen,
	onClose,
	onCreatePlaylist,
}: CreatePlaylistDialogProps) {
	const [playlistName, setPlaylistName] = useState("");
	const [description, setDescription] = useState("");
	const playlistNameId = useId();
	const descriptionId = useId();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (playlistName.trim()) {
			onCreatePlaylist({
				name: playlistName.trim(),
				description: description.trim(),
			});
			setPlaylistName("");
			setDescription("");
			onClose();
		}
	};

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
						className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
					>
						<div className="bg-zinc-900 rounded-xl border border-white/10 p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-white">
									Create Playlist
								</h2>
								<button
									type="button"
									onClick={onClose}
									className="text-gray-400 hover:text-white transition-colors"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label
										htmlFor={playlistNameId}
										className="text-sm font-medium text-gray-300 mb-2 block"
									>
										Playlist Name
									</label>
									<Input
										id={playlistNameId}
										value={playlistName}
										onChange={(e) => setPlaylistName(e.target.value)}
										placeholder="My Awesome Playlist"
										className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
										autoFocus
									/>
								</div>

								<div>
									<label
										htmlFor={descriptionId}
										className="text-sm font-medium text-gray-300 mb-2 block"
									>
										Description (optional)
									</label>
									<Input
										id={descriptionId}
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Add a description..."
										className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
									/>
								</div>

								<div className="flex gap-3 pt-4">
									<Button
										type="button"
										onClick={onClose}
										variant="outline"
										className="flex-1 bg-transparent border-white/20 hover:bg-white/5 text-white"
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={!playlistName.trim()}
										className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
									>
										Create
									</Button>
								</div>
							</form>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
