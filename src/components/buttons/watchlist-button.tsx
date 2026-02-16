/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Plus } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { useWatchlist } from "@/domains/movies/hooks/useWatchlist";
import { cn } from "@/lib/utils";
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
		} catch (_error) {
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
					"rounded-2xl w-14 h-14 transition-all duration-500 relative overflow-hidden group border border-transparent",
					optimisticState
						? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.15)]"
						: "text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border-white/5",
					className
				)}
			>
				{/* Ripple effect */}
				<AnimatePresence>
					{optimisticState && (
						<motion.div
							initial={{ scale: 0, opacity: 0.8 }}
							animate={{ scale: 2.5, opacity: 0 }}
							transition={{ duration: 0.6 }}
							className="absolute inset-0 rounded-full bg-yellow-500/20 px-2"
						/>
					)}
				</AnimatePresence>

				<motion.div
					key={optimisticState ? "active" : "inactive"}
					animate={{
						scale: optimisticState ? [1, 1.3, 1] : 1,
						rotate: optimisticState ? [0, 15, -15, 0] : 0,
					}}
					transition={{ duration: 0.4 }}
					className="relative z-10"
				>
					{isPending ? (
						<Loader2 className="h-6 w-6 animate-spin text-white" />
					) : optimisticState ? (
						<Check className="h-6 w-6 text-yellow-500" />
					) : (
						<Plus className="h-6 w-6 text-white transition-transform group-hover:rotate-90" />
					)}
				</motion.div>

				{/* Particles for Watchlist */}
				<AnimatePresence>
					{optimisticState && (
						<div className="absolute inset-0 pointer-events-none">
							{[...Array(6)].map((_, i) => (
								<motion.div
									key={`wp-${mediaId}-${i}`}
									initial={{ scale: 0, x: 0, y: 0 }}
									animate={{
										scale: [0, 1, 0],
										x: Math.cos((i * Math.PI) / 3) * 25,
										y: Math.sin((i * Math.PI) / 3) * 25,
									}}
									transition={{ duration: 0.6 }}
									className="absolute w-1 h-1 bg-yellow-400 rounded-full left-1/2 top-1/2"
								/>
							))}
						</div>
					)}
				</AnimatePresence>
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
					"gap-2 rounded-xl transition-all",
					optimisticState ? "text-yellow-500 bg-yellow-500/10" : "text-white/60 hover:text-white",
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
				<span className="font-bold">{optimisticState ? 'Saved' : 'Save'}</span>
			</Button>
		);
	}

	// Default variant (The Big Button)
	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="h-full"
		>
			<Button
				onClick={handleClick}
				disabled={isLoading}
				size="lg"
				className={cn(
					"h-full px-8 gap-3 transition-all duration-500 font-black uppercase tracking-tighter rounded-xl border",
					optimisticState
						? "bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.3)]"
						: "bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-md",
					className
				)}
			>
				{isPending ? (
					<Loader2 className="h-5 w-5 animate-spin" />
				) : optimisticState ? (
					<>
						<Check className="h-5 w-5 stroke-[3px]" />
						<span>In Watchlist</span>
					</>
				) : (
					<>
						<Plus className="h-5 w-5 stroke-[3px]" />
						<span>Watchlist</span>
					</>
				)}
			</Button>
		</motion.div>
	);
}
