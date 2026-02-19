import { useStore } from "@tanstack/react-store";
import { FileJson, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/forms/textarea";
import { bulkCreateMediaAction, mediaUIStore } from "../media.store";

export function BulkCreateDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [jsonInput, setJsonInput] = useState("");
	const { isBulkCreating } = useStore(mediaUIStore);

	const handleImport = async () => {
		try {
			const data = JSON.parse(jsonInput);
			if (!Array.isArray(data)) {
				toast.error("Input must be a JSON array");
				return;
			}

			const success = await bulkCreateMediaAction(data);
			if (success) {
				toast.success(`Successfully imported ${data.length} items`);
				setIsOpen(false);
				setJsonInput("");
			}
		} catch (_e: unknown) {
			if (_e instanceof Error) {
				toast.error(_e.message || "Invalid JSON format");
			} else {
				toast.error("Invalid JSON format");
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-9 rounded-xl gap-2 text-[10px] font-bold uppercase"
				>
					<Upload className="h-3.5 w-3.5" />
					Bulk Import
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Bulk Import Media</DialogTitle>
					<DialogDescription>
						Paste a JSON array of media items to import.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="relative">
						<Textarea
							placeholder='[{"title": "Movie 1", "type": "MOVIE", ...}, ...]'
							className="h-[300px] font-mono text-xs"
							value={jsonInput}
							onChange={(e) => setJsonInput(e.target.value)}
						/>
						<FileJson className="absolute right-3 top-3 h-4 w-4 text-muted-foreground opacity-50" />
					</div>
					<div className="text-[10px] text-muted-foreground">
						<p>
							Required fields: title, type (MOVIE, EPISODE, TRACK), description,
							releaseYear, duration
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleImport}
						disabled={isBulkCreating || !jsonInput}
					>
						{isBulkCreating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Importing...
							</>
						) : (
							"Import Media"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
