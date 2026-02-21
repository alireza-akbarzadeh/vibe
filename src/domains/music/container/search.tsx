/** biome-ignore-all lint/suspicious/noArrayIndexKey: The index is used as a key for a list of characters, which is stable. */
import { useStore } from "@tanstack/react-store";
import { Heart, MoreHorizontal, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "@/components/motion";
// Import your stores and types
import {
	musicAction,
	musicStore,
	type Song,
} from "@/domains/music/music.store";
import { orpc } from "@/lib/orpc";
import { MusicSearch } from "../components/music-search";

// Define types for search results

interface Artist {
	id: string;
	name: string;
	image: string;
	type: string;
}

interface Album {
	id: string;
	title: string;
	artist: string;
	art: string;
	year: string;
}

const searchFilters = [
	"All",
	"Songs",
	"Artists",
	"Playlists",
	"Albums",
	"Podcasts & Shows",
];

export function SearchView() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("All");
	const [songs, setSongs] = useState<Song[]>([]);
	const [artists, setArtists] = useState<Artist[]>([]);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const activeSongId = useStore(musicStore, (s) => s.currentSong?.id);

	// Fetch media from API
	useEffect(() => {
		const fetchMedia = async () => {
			try {
				setIsLoading(true);
				const response = await client.media.list({
					page: 1,
					limit: 50,
					type: "TRACK",
				});

				// Transform API response to songs format
				const transformedSongs: Song[] = response.data.items.map((item) => ({
					id: item.id,
					title: item.title,
					artist: item.creators?.[0]?.creator.name || "Unknown Artist",
					album: item.collection?.title || "Unknown Album",
					albumArt:
						item.thumbnail ||
						"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
					duration: item.duration || 200,
					mediaId: item.id,
				}));

				setSongs(transformedSongs);

				setArtists([
					{
						id: "a1",
						name: transformedSongs[0]?.artist || "Artist",
						image:
							transformedSongs[0]?.albumArt ||
							"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
						type: "Artist",
					},
				]);

				setAlbums([]);
			} catch (error) {
				console.error("Failed to fetch media:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMedia();
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="min-h-screen bg-[#121212] p-8 pb-32 overflow-y-auto">
			{/* 1. Search Bar */}
			<div className="sticky top-0 z-50 py-4 mb-2 bg-[#121212]/95 backdrop-blur-md">
				<MusicSearch
					onSearchChange={setSearchQuery}
					searchQuery={searchQuery}
				/>
			</div>

			{/* 2. Category Filter Chips */}
			<div className="flex items-center gap-2 mb-8 sticky top-20 z-40 bg-[#121212] py-2 ">
				{searchFilters.map((filter) => (
					<button
						type="button"
						key={filter}
						onClick={() => setActiveFilter(filter)}
						className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === filter
								? "bg-white text-black"
								: "bg-white/10 text-white hover:bg-white/20"
							}`}
					>
						{filter}
					</button>
				))}
			</div>
			{/* 3. Conditional Content based on Filter */}
			<AnimatePresence mode="wait">
				{(activeFilter === "All" || activeFilter === "Songs") && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
					>
						<div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 my-12">
							{/* Top Result */}
							<section>
								<h2 className="text-2xl font-bold text-white mb-4">
									Top result
								</h2>
								{isLoading ? (
									<div className="bg-[#181818] p-6 rounded-xl h-64 animate-pulse" />
								) : artists.length > 0 ? (
									<motion.div
										whileHover={{
											backgroundColor: "rgba(255, 255, 255, 0.05)",
										}}
										className="bg-[#181818] p-6 rounded-xl group relative cursor-pointer transition-colors"
									>
										<img
											src={artists[0].image}
											className="w-24 h-24 rounded-full shadow-2xl mb-6 object-cover"
											alt=""
										/>
										<h3 className="text-3xl font-bold text-white mb-2">
											{artists[0].name}
										</h3>
										<span className="px-3 py-1 bg-black/40 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
											{artists[0].type}
										</span>
										<button
											type="button"
											className="absolute bottom-6 right-6 w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
										>
											<Play className="w-6 h-6 text-white fill-white ml-1" />
										</button>
									</motion.div>
								) : (
									<div className="bg-[#181818] p-6 rounded-xl text-white/50 text-center">
										No results found
									</div>
								)}
							</section>

							{/* Songs List */}
							<section>
								<h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
								{isLoading ? (
									<div className="space-y-2">
										{[...Array(5)].map((_, i) => (
											<div
												key={i}
												className="h-14 bg-white/10 rounded-md animate-pulse"
											/>
										))}
									</div>
								) : (
									<div className="space-y-0.5">
										{songs.map((song) => {
											const isCurrent = activeSongId === song.id;
											return (
												<div
													key={song.id}
													onClick={() => musicAction.setCurrentSong(song)}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															musicAction.setCurrentSong(song);
														}
													}}
													className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 group cursor-pointer"
												>
													<div className="relative w-10 h-10 shrink-0">
														<img
															src={song.albumArt}
															className="w-full h-full rounded object-cover"
															alt=""
														/>
														<Play
															className={`absolute inset-0 m-auto w-4 h-4 text-white fill-white ${isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
														/>
													</div>
													<div className="flex-1 min-w-0">
														<div
															className={`text-sm font-medium truncate ${isCurrent ? "text-pink-400" : "text-white group-hover:text-pink-400"}`}
														>
															{song.title}
														</div>
														<div className="text-gray-400 text-xs truncate group-hover:text-white">
															{song.artist}
														</div>
													</div>
													<div className="flex items-center gap-4 px-2">
														<Heart className="w-4 h-4 text-pink-500 fill-pink-500 opacity-0 group-hover:opacity-100" />
														<span className="text-gray-400 text-xs tabular-nums">
															{formatTime(song.duration)}
														</span>
														<MoreHorizontal className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white" />
													</div>
												</div>
											);
										})}
									</div>
								)}
							</section>
						</div>
					</motion.div>
				)}

				{/* 4. Artists Section */}
				{(activeFilter === "All" || activeFilter === "Artists") && (
					<section className="mb-12">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-2xl font-bold text-white">Artists</h2>
							{activeFilter === "All" && (
								<button
									type="button"
									className="text-sm font-bold text-gray-400 hover:underline"
								>
									Show all
								</button>
							)}
						</div>
						{isLoading ? (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
								{[...Array(6)].map((_, i) => (
									<div
										key={i}
										className="bg-[#181818] p-4 rounded-xl h-60 animate-pulse"
									/>
								))}
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
								{artists.map((artist) => (
									<div
										key={artist.id}
										className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-colors cursor-pointer group"
									>
										<div className="relative mb-4">
											<img
												src={artist.image}
												className="w-full aspect-square rounded-full shadow-lg object-cover"
												alt=""
											/>
											<button
												type="button"
												className="absolute bottom-2 right-2 w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
											>
												<Play className="w-5 h-5 text-white fill-white ml-0.5" />
											</button>
										</div>
										<div className="text-white font-bold text-sm truncate">
											{artist.name}
										</div>
										<div className="text-gray-400 text-xs mt-1">
											{artist.type}
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				)}

				{/* 5. Albums Section */}
				{(activeFilter === "All" || activeFilter === "Albums") && (
					<section className="mb-12">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-2xl font-bold text-white">Albums</h2>
							{activeFilter === "All" && (
								<button
									type="button"
									className="text-sm font-bold text-gray-400 hover:underline"
								>
									Show all
								</button>
							)}
						</div>
						{isLoading ? (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
								{[...Array(6)].map((_, i) => (
									<div
										key={i}
										className="bg-[#181818] p-4 rounded-xl h-60 animate-pulse"
									/>
								))}
							</div>
						) : albums.length > 0 ? (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
								{albums.map((album) => (
									<div
										key={album.id}
										className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-colors cursor-pointer group"
									>
										<div className="relative mb-4">
											<img
												src={album.art}
												className="w-full aspect-square rounded-lg shadow-lg object-cover"
												alt=""
											/>
											<button
												type="button"
												className="absolute bottom-2 right-2 w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
											>
												<Play className="w-5 h-5 text-white fill-white ml-0.5" />
											</button>
										</div>
										<div className="text-white font-bold text-sm truncate">
											{album.title}
										</div>
										<div className="text-gray-400 text-xs mt-1">
											{album.year} • {album.artist}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="bg-[#181818] p-8 rounded-xl text-white/50 text-center">
								No albums found
							</div>
						)}
					</section>
				)}
			</AnimatePresence>
		</div>
	);
}
