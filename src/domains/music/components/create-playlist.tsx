import { useId, useState } from "react";
import { AppDialog } from "@/components/app-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { musicAction } from "../music.store";



interface CreatePlaylistDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreatePlaylistDialog({
	isOpen,
	onClose,
}: CreatePlaylistDialogProps) {
	const [playlistName, setPlaylistName] = useState("");
	const [description, setDescription] = useState("");
	const playlistNameId = useId();
	const descriptionId = useId();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (playlistName.trim()) {
			musicAction.createPlaylist({
				name: playlistName.trim(),
				description: description.trim(),
			});
			// Reset and Close
			setPlaylistName("");
			setDescription("");
			onClose();
		}
	};

	return (
		<AppDialog
			open={isOpen}
			onOpenChange={(open) => !open && onClose()}
			component="drawer" // Defaults to Dialog on desktop, Drawer on mobile
			title="Create Playlist"
			description="Give your new playlist a name and description."
		>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="space-y-2">
					<label
						htmlFor={playlistNameId}
						className="text-sm font-medium text-zinc-400"
					>
						Playlist Name
					</label>
					<Input
						id={playlistNameId}
						value={playlistName}
						onChange={(e) => setPlaylistName(e.target.value)}
						placeholder="My Awesome Playlist"
						className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:ring-purple-500"
						autoFocus
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor={descriptionId}
						className="text-sm font-medium text-zinc-400"
					>
						Description (optional)
					</label>
					<Input
						id={descriptionId}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Add an optional description"
						className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:ring-purple-500"
					/>
				</div>

				<div className="flex gap-3 pt-4">
					<Button
						type="button"
						onClick={onClose}
						variant="ghost"
						className="flex-1 text-white hover:bg-white/5"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={!playlistName.trim()}
						className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
					>
						Create
					</Button>
				</div>
			</form>
		</AppDialog>
	);
}