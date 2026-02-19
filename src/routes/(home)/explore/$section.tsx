/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Calendar,
	Check,
	Filter,
	LayoutGrid,
	Search,
	SlidersHorizontal,
	SortAsc,
	SortDesc,
	Sparkles,
	X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	AnimatePresence,
	motion,
	useScroll,
	useTransform,
} from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { MovieCard } from "@/domains/movies/components/movie-card";
import {
	getSectionInfiniteQueryOptions,
	SECTION_CONFIG,
	type SectionSlug,
} from "@/domains/movies/explore.queries";
import { client } from "@/orpc/client";
import type { MediaList } from "@/orpc/models/media.schema";

export const Route = createFileRoute("/(home)/explore/$section")({
	component: RouteComponent,
});

interface FilterContentProps {
	genres: { id: string; name: string }[];
	selectedGenreIds: string[];
	setSelectedGenreIds: React.Dispatch<React.SetStateAction<string[]>>;
	yearRange: [number, number];
	setYearRange: (val: [number, number]) => void;
	sortBy: "NEWEST" | "OLDEST" | "TITLE";
	setSortBy: (val: "NEWEST" | "OLDEST" | "TITLE") => void;
}

const FilterContent = ({
	genres,
	selectedGenreIds,
	setSelectedGenreIds,
	yearRange,
	setYearRange,
	sortBy,
	setSortBy,
}: FilterContentProps) => (
	<div className="space-y-10">
		{/* Genres Section */}
		<div className="space-y-4">
			<div className="flex items-center gap-2 text-white/40 mb-2">
				<Filter className="w-4 h-4" />
				<span className="text-xs font-black uppercase tracking-widest">
					Genre DNA
				</span>
			</div>
			<div className="flex flex-wrap gap-2 max-h-48 md:max-h-64 overflow-y-auto pr-2 custom-scrollbar">
				{genres.map((genre) => {
					const isSelected = selectedGenreIds.includes(genre.id);
					return (
						<Button
							key={genre.id}
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedGenreIds((prev) =>
									isSelected
										? prev.filter((id) => id !== genre.id)
										: [...prev, genre.id],
								);
							}}
							className={`rounded-full px-4 h-9 border-white/10 transition-all duration-300 ${isSelected ? "bg-purple-500 border-purple-500 text-white" : "bg-transparent text-white/40 hover:text-white"}`}
						>
							{genre.name}
							{isSelected && <Check className="ml-1 w-3 h-3" />}
						</Button>
					);
				})}
			</div>
		</div>

		{/* Time Horizon Section */}
		<div className="space-y-4">
			<div className="flex items-center gap-2 text-white/40 mb-2">
				<Calendar className="w-4 h-4" />
				<span className="text-xs font-black uppercase tracking-widest">
					Time Horizon
				</span>
			</div>
			<div className="px-2 pt-2">
				<Slider
					defaultValue={[1900, 2026]}
					max={2026}
					min={1900}
					step={1}
					value={yearRange}
					onValueChange={(val) => setYearRange(val as [number, number])}
					className="mb-4"
				/>
				<div className="flex justify-between text-[10px] font-black tracking-widest text-white/20 uppercase">
					<span>BCE {yearRange[0]}</span>
					<span>CE {yearRange[1]}</span>
				</div>
			</div>
		</div>

		{/* Sort Architecture Section */}
		<div className="space-y-4">
			<div className="flex items-center gap-2 text-white/40 mb-2">
				{sortBy === "NEWEST" ? (
					<SortDesc className="w-4 h-4" />
				) : sortBy === "OLDEST" ? (
					<SortAsc className="w-4 h-4" />
				) : (
					<LayoutGrid className="w-4 h-4" />
				)}
				<span className="text-xs font-black uppercase tracking-widest">
					Sort Architecture
				</span>
			</div>
			<div className="grid grid-cols-1 gap-2">
				{[
					{ id: "NEWEST", label: "Chronological (Newest)", icon: SortDesc },
					{ id: "OLDEST", label: "Legacy (Oldest)", icon: SortAsc },
					{ id: "TITLE", label: "Alphabetical", icon: LayoutGrid },
				].map((option) => {
					const isSelected = sortBy === option.id;
					const Icon = option.icon;
					return (
						<Button
							key={option.id}
							variant="ghost"
							onClick={() =>
								setSortBy(option.id as "NEWEST" | "OLDEST" | "TITLE")
							}
							className={`justify-start h-12 rounded-xl transition-all duration-300 ${isSelected ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
						>
							<Icon className="w-4 h-4 mr-3" />
							<span className="font-bold">{option.label}</span>
							{isSelected && (
								<motion.div
									layoutId="sort-active"
									className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]"
								/>
							)}
						</Button>
					);
				})}
			</div>
		</div>
	</div>
);

function RouteComponent() {
	const { section } = Route.useParams();
	const sectionSlug = section.toLowerCase() as SectionSlug;
	const config = SECTION_CONFIG[sectionSlug];

	const loadMoreRef = useRef<HTMLDivElement>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	// Advanced Filters State
	const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
	const [yearRange, setYearRange] = useState<[number, number]>([1900, 2026]);
	const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "TITLE">("NEWEST");
	const [showFilters, setShowFilters] = useState(false);

	const { scrollY } = useScroll();
	const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

	const { data: genresData } = useQuery({
		queryKey: ["genres"],
		queryFn: () => client.genres.list(),
	});

	const genres = (genresData?.data as { id: string; name: string }[]) || [];

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const activeFilters = useMemo(
		() => ({
			genreIds: selectedGenreIds.length > 0 ? selectedGenreIds : undefined,
			releaseYearFrom: yearRange[0] > 1900 ? yearRange[0] : undefined,
			releaseYearTo: yearRange[1] < 2026 ? yearRange[1] : undefined,
			sortBy: sortBy as "NEWEST" | "OLDEST" | "TITLE" | "MANUAL",
		}),
		[selectedGenreIds, yearRange, sortBy],
	);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useInfiniteQuery(
		getSectionInfiniteQueryOptions(
			sectionSlug,
			20,
			debouncedSearch,
			activeFilters,
		),
	);

	useEffect(() => {
		if (!loadMoreRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1, rootMargin: "400px" },
		);

		observer.observe(loadMoreRef.current);

		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const allMovies: MediaList[] =
		data?.pages.flatMap((page) => {
			const typedPage = page as unknown as { data: { items: MediaList[] } };
			return typedPage?.data?.items || [];
		}) ?? [];

	if (!config) {
		return (
			<div className="min-h-screen bg-[#050505] flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl"
				>
					<h1 className="text-3xl font-black text-white mb-6 italic uppercase tracking-tighter">
						Catalog Entry Not Found
					</h1>
					<Link to="/movies">
						<Button className="bg-white text-black hover:bg-white/90 font-bold rounded-xl px-8 h-12">
							Return to Discovery
						</Button>
					</Link>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
			{/* Intelligent Progressive Background */}
			<div className="fixed inset-0 pointer-events-none z-0">
				<motion.div
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
					className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"
				/>
				<motion.div
					animate={{
						scale: [1.1, 1, 1.1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[150px]"
				/>
				<div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[100px]" />
			</div>

			{/* Sticky Cinematic Header */}
			<motion.header
				style={{ opacity: headerOpacity }}
				className="sticky top-0 z-50 w-full px-6 md:px-12 py-6 flex items-center justify-between"
			>
				<Link to="/movies" className="group">
					<motion.div
						whileHover={{ x: -4 }}
						className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
						<span>Discovery</span>
					</motion.div>
				</Link>

				<div className="flex items-center gap-4">
					<div className="md:hidden">
						<Drawer>
							<DrawerTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="w-10 h-10 rounded-full bg-white/5 border border-white/10"
								>
									<Filter className="w-5 h-5 text-purple-400" />
								</Button>
							</DrawerTrigger>
							<DrawerContent className="bg-[#0a0a0a] border-white/10 p-6 h-[80vh]">
								<DrawerHeader className="px-0">
									<DrawerTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
										Refine Discovery
									</DrawerTitle>
									<DrawerDescription className="text-white/40">
										Adjust parameters for the current frequency.
									</DrawerDescription>
								</DrawerHeader>
								<div className="mt-4 overflow-y-auto pb-10">
									<FilterContent
										genres={genres}
										selectedGenreIds={selectedGenreIds}
										setSelectedGenreIds={setSelectedGenreIds}
										yearRange={yearRange}
										setYearRange={setYearRange}
										sortBy={sortBy}
										setSortBy={setSortBy}
									/>
								</div>
							</DrawerContent>
						</Drawer>
					</div>

					<div className="hidden md:flex items-center gap-1 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
						<Button
							size="icon"
							variant="ghost"
							className="w-9 h-9 rounded-lg hover:bg-white/5 opacity-40"
						>
							<LayoutGrid className="w-4 h-4" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							onClick={() => setShowFilters(!showFilters)}
							className={`w-9 h-9 rounded-lg transition-all duration-300 ${showFilters ? "bg-purple-600 shadow-xl opacity-100" : "hover:bg-white/5 opacity-40"}`}
						>
							<SlidersHorizontal className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</motion.header>

			<main className="relative z-10 max-w-450 mx-auto px-6 md:px-12 pt-4 pb-24">
				{/* Section Intro */}
				<div className="mb-12 md:mb-20">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
					>
						<div className="flex items-center gap-3 mb-4">
							<div className="h-px w-12 bg-linear-to-r from-purple-500 to-transparent" />
							<span className="text-xs font-black uppercase tracking-[0.3em] text-purple-400">
								Exploration Mode
							</span>
						</div>
						<h1 className="text-5xl md:text-8xl font-black text-white mb-6 italic uppercase tracking-tighter leading-[0.85]">
							{config.title}
						</h1>
						<p className="text-lg md:text-2xl text-white/40 max-w-2xl font-medium tracking-tight leading-relaxed">
							{config.subtitle}
						</p>
					</motion.div>

					{/* Search Interaction Dock */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mt-12 group relative max-w-4xl"
					>
						<div
							className={`absolute inset-0 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl transition-opacity duration-500 ${isSearchFocused ? "opacity-100" : "opacity-0"}`}
						/>
						<div className="flex flex-col gap-4">
							<div
								className={`relative flex items-center bg-white/5 backdrop-blur-3xl border transition-all duration-500 rounded-2xl ${isSearchFocused ? "border-purple-500/50 ring-4 ring-purple-500/10" : "border-white/10"}`}
							>
								<Search
									className={`absolute left-5 w-6 h-6 transition-colors duration-300 ${isSearchFocused ? "text-purple-400" : "text-white/20"}`}
								/>
								<Input
									type="text"
									placeholder={`Explore ${config.title.toLowerCase()}...`}
									value={searchQuery}
									onFocus={() => setIsSearchFocused(true)}
									onBlur={() => setIsSearchFocused(false)}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="h-16 pl-14 pr-44 bg-transparent border-none text-xl font-medium placeholder:text-white/10 focus-visible:ring-0 focus-visible:ring-offset-0"
								/>
								<div className="absolute right-4 flex items-center gap-2">
									<AnimatePresence>
										{searchQuery && (
											<motion.div
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}
											>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setSearchQuery("")}
													className="h-9 w-9 p-0 hover:bg-white/10 rounded-full"
												>
													<X className="w-5 h-5 text-white/50" />
												</Button>
											</motion.div>
										)}
									</AnimatePresence>
									<div className="hidden md:block">
										<Button
											onClick={() => setShowFilters(!showFilters)}
											className={`h-11 px-6 rounded-xl font-bold transition-all duration-300 ${showFilters ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
										>
											<SlidersHorizontal className="w-4 h-4 mr-2" />
											Filters
											{selectedGenreIds.length > 0 && (
												<Badge className="ml-2 bg-purple-500 hover:bg-purple-500 text-white border-none h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
													{selectedGenreIds.length}
												</Badge>
											)}
										</Button>
									</div>

									<div className="md:hidden">
										<Drawer>
											<DrawerTrigger asChild>
												<Button className="h-11 px-4 rounded-xl font-bold bg-white/10 text-white/60 hover:bg-white/20">
													<SlidersHorizontal className="w-4 h-4" />
													{selectedGenreIds.length > 0 && (
														<Badge className="ml-2 bg-purple-500 hover:bg-purple-500 text-white border-none h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
															{selectedGenreIds.length}
														</Badge>
													)}
												</Button>
											</DrawerTrigger>
											<DrawerContent className="bg-[#0a0a0a] border-white/10 p-6 h-[80vh]">
												<DrawerHeader className="px-0">
													<DrawerTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
														Refine Discovery
													</DrawerTitle>
													<DrawerDescription className="text-white/40">
														Adjust parameters for the current frequency.
													</DrawerDescription>
												</DrawerHeader>
												<div className="mt-4 overflow-y-auto pb-10">
													<FilterContent
														genres={genres}
														selectedGenreIds={selectedGenreIds}
														setSelectedGenreIds={setSelectedGenreIds}
														yearRange={yearRange}
														setYearRange={setYearRange}
														sortBy={sortBy}
														setSortBy={setSortBy}
													/>
												</div>
											</DrawerContent>
										</Drawer>
									</div>
								</div>
							</div>

							{/* Advanced Filter Panel (Desktop Only) */}
							<div className="hidden md:block">
								<AnimatePresence>
									{showFilters && (
										<motion.div
											initial={{ opacity: 0, height: 0, y: -20 }}
											animate={{ opacity: 1, height: "auto", y: 0 }}
											exit={{ opacity: 0, height: 0, y: -20 }}
											transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
											className="overflow-hidden"
										>
											<div className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl">
												<div className="grid grid-cols-3 gap-10">
													<FilterContent
														genres={genres}
														selectedGenreIds={selectedGenreIds}
														setSelectedGenreIds={setSelectedGenreIds}
														yearRange={yearRange}
														setYearRange={setYearRange}
														sortBy={sortBy}
														setSortBy={setSortBy}
													/>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Content Grid */}
				{isLoading ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
						{Array.from({ length: 15 }, (_, i) => (
							<div
								key={`loading-skeleton-${sectionSlug}-${i}-${Math.random()}`}
								className="aspect-2/3 bg-white/5 rounded-2xl animate-pulse relative overflow-hidden"
							>
								<div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
							</div>
						))}
					</div>
				) : isError ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10"
					>
						<p className="text-xl font-bold text-red-400 mb-6">
							UNABLE TO RETRIEVE FREQUENCY
						</p>
						<Button
							onClick={() => window.location.reload()}
							className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-10"
						>
							Reconnect
						</Button>
					</motion.div>
				) : (
					<div className="space-y-12">
						<AnimatePresence mode="popLayout">
							{allMovies.length === 0 ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-center py-40"
								>
									<Sparkles className="w-12 h-12 text-white/10 mx-auto mb-6" />
									<p className="text-2xl font-black text-white/20 uppercase italic tracking-widest">
										Zero Matches Detected
									</p>
								</motion.div>
							) : (
								<motion.div
									layout
									initial="hidden"
									animate="show"
									variants={{
										show: {
											transition: {
												staggerChildren: 0.05,
											},
										},
									}}
									className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-6 md:gap-x-8"
								>
									{allMovies.map((movie, index) => (
										<motion.div
											key={`${movie.id}-${index}`}
											variants={{
												hidden: { opacity: 0, y: 20 },
												show: { opacity: 1, y: 0 },
											}}
										>
											<MovieCard
												movie={movie}
												variant="standard"
												index={index % 20}
												showProgress={false}
											/>
										</motion.div>
									))}
								</motion.div>
							)}
						</AnimatePresence>

						{/* Paginated Loader Infrastructure */}
						{(hasNextPage || isFetchingNextPage) && (
							<div
								ref={loadMoreRef}
								className="py-20 flex flex-col items-center justify-center gap-4"
							>
								<div className="w-12 h-12 relative">
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: "linear",
										}}
										className="absolute inset-0 border-4 border-purple-500/20 rounded-full"
									/>
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 1.5,
											repeat: Infinity,
											ease: "linear",
										}}
										className="absolute inset-0 border-t-4 border-purple-500 rounded-full"
									/>
								</div>
								<span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 animate-pulse">
									Synchronizing...
								</span>
							</div>
						)}
					</div>
				)}
			</main>

			{/* Mobile Dock Overlay */}
			<motion.div
				initial={{ y: 100 }}
				animate={{ y: 0 }}
				className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl z-50 flex items-center gap-10"
			>
				<Drawer>
					<DrawerTrigger asChild>
						<button type="button" className="relative">
							<Filter className="w-6 h-6 text-purple-400" />
							{selectedGenreIds.length > 0 && (
								<div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,1)]" />
							)}
						</button>
					</DrawerTrigger>
					<DrawerContent className="bg-[#0a0a0a] border-white/10 p-6 h-[80vh]">
						<DrawerHeader className="px-0">
							<DrawerTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
								Refine Discovery
							</DrawerTitle>
							<DrawerDescription className="text-white/40">
								Adjust parameters for the current frequency.
							</DrawerDescription>
						</DrawerHeader>
						<div className="mt-4 overflow-y-auto pb-10">
							<FilterContent
								genres={genres}
								selectedGenreIds={selectedGenreIds}
								setSelectedGenreIds={setSelectedGenreIds}
								yearRange={yearRange}
								setYearRange={setYearRange}
								sortBy={sortBy}
								setSortBy={setSortBy}
							/>
						</div>
					</DrawerContent>
				</Drawer>

				<LayoutGrid className="w-6 h-6 text-white" />
				<SlidersHorizontal className="w-6 h-6 text-white/40" />
			</motion.div>
		</div>
	);
}
