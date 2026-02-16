// components/watchlist-button-compact.tsx
import { useWatchlist } from "@/domains/movies/hooks/useWatchlist";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bookmark, Check, Loader2, Plus } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { Button } from "../ui/button";

interface WatchListButtonCompactProps {
	mediaId: string;
	variant?: "default" | "icon" | "minimal";
	className?: string;
}

export function WatchListButton({
	mediaId,
	variant = "default",
	className
}: WatchListButtonCompactProps) {
	const { useIsInWatchlist, useAddToWatchlist, useRemoveFromWatchlist } = useWatchlist();
	const { data: isInWatchlist = false, isLoading: isChecking } = useIsInWatchlist(mediaId);

	const addMutation = useAddToWatchlist();
	const removeMutation = useRemoveFromWatchlist();

	const [optimisticState, setOptimisticState] = useOptimistic(
		isInWatchlist,
		(_, newState: boolean) => newState
	);

	const isLoading = isChecking || addMutation.isPending || removeMutation.isPending;
	const isPending = addMutation.isPending || removeMutation.isPending;

	const handleClick = async () => {
		// Update optimistic state immediately
		startTransition(() => {
			setOptimisticState(!optimisticState);
		});

		try {
			if (optimisticState) {
				await removeMutation.mutateAsync(mediaId);
			} else {
				await addMutation.mutateAsync(mediaId);
			}
		} catch (error) {
			startTransition(() => {
				setOptimisticState(optimisticState);
			});
		}
	};

	if (variant === "icon") {
		return (
			<Button
				size="icon"
				variant="ghost"
				onClick={handleClick}
				disabled={isLoading}
				className={cn(
					"rounded-full",
					optimisticState && "text-yellow-500",
					className
				)}
			>
				{isPending ? (
					<Loader2 className="h-5 w-5 animate-spin" />
				) : (
					<Bookmark className={cn("h-5 w-5", optimisticState && "fill-current")} />
				)}
			</Button>
		);
	}

	if (variant === "minimal") {
		return (
			<Button
				variant="ghost"
				size="sm"
				onClick={handleClick}
				disabled={isLoading}
				className={cn(
					"gap-2",
					optimisticState && "text-yellow-500",
					className
				)}
			>
				{isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : optimisticState ? (
					<Check className="h-4 w-4" />
				) : (
					<Plus className="h-4 w-4" />
				)}
				<span>{optimisticState ? 'Saved' : 'Save'}</span>
			</Button>
		);
	}

	// Default variant
	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<Button
				onClick={handleClick}
				disabled={isLoading}
				variant={optimisticState ? "default" : "outline"}
				className={cn(
					"gap-2 transition-all",
					optimisticState && "bg-yellow-500 hover:bg-yellow-600 text-black",
					className
				)}
			>
				{isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : optimisticState ? (
					<>
						<Check className="h-4 w-4" />
						<span>In Watchlist</span>
					</>
				) : (
					<>
						<Plus className="h-4 w-4" />
						<span>Watchlist</span>
					</>
				)}
			</Button>
		</motion.div>
	);
}
