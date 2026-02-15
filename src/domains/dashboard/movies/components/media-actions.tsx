import { useNavigate } from "@tanstack/react-router";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "@/components/app-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MediaItem } from "../media.store";
import { deleteMediaAction } from "../media.store";

interface MediaActionsProps {
    media: MediaItem;
}

export function MediaActions({ media }: MediaActionsProps) {
    const navigate = useNavigate();

    const handleDelete = async () => {
        const success = await deleteMediaAction(media.id);
        if (success) {
            toast.success("Media deleted successfully");
        } else {
            toast.error("Failed to delete media");
        }
    };

    const handleView = () => {
        // Navigate to media detail page
        window.open(`/movies/${media.id}`, "_blank");
    };

    const handleEdit = () => {
        navigate({
            to: "/dashboard/movies/edit",
            search: { mediaId: media.id },
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-muted focus-visible:ring-0"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 p-2 rounded-xl shadow-xl border-border/50"
            >
                <div className="px-3 py-2 mb-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                        Media Actions
                    </p>
                    <p className="text-xs font-bold truncate">{media.title}</p>
                </div>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    <span className="text-xs font-bold">View Details</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    <span className="text-xs font-bold">Edit Media</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <AppDialog component="drawer"
                    title="Confirm Deletion"
                    description={`Are you sure you want to delete "${media.title}"? This action cannot be undone.`}
                    trigger={
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span className="text-xs font-bold">Delete Media</span>
                        </DropdownMenuItem>
                    }
                >
                    <div className="flex gap-3 justify-end pt-4">
                        <Button variant="outline" size="sm">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </AppDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
