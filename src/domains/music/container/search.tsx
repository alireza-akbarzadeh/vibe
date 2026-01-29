import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MoreHorizontal, Play } from "lucide-react";
import { useState } from "react";
// Import your stores and types
import { musicStore, setCurrentSong } from "@/domains/music/music.store";
import { MusicSearch } from "../components/music-search";

// --- MOCK DATA ---
const MOCK_DATA = {
	songs: [
		{
			id: 1,
			title: "Blinding Lights",
			artist: "The Weeknd",
			album: "After Hours",
			albumArt:
				"https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
			duration: 200,
		},
		{
			id: 2,
			title: "Save Your Tears",
			artist: "The Weeknd",
			album: "After Hours",
			albumArt:
				"https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
			duration: 215,
		},
		{
			id: 3,
			title: "Starboy",
			artist: "The Weeknd",
			album: "Starboy",
			albumArt:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
			duration: 230,
		},
		{
			id: 4,
			title: "Die For You",
			artist: "The Weeknd",
			album: "Starboy",
			albumArt:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
			duration: 260,
		},
	],
	artists: [
		{
			id: "a1",
			name: "The Weeknd",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
			type: "Artist",
		},
		{
			id: "a2",
			name: "Madonna",
			image:
				"https://images.unsplash.com/photo-1514525253344-f814d074358a?w=300",
			type: "Artist",
		},
		{
			id: "a3",
			name: "Dua Lipa",
			image:
				"https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?w=300",
			type: "Artist",
		},
	],
	albums: [
		{
			id: "al1",
			title: "After Hours",
			artist: "The Weeknd",
			art: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
			year: "2020",
		},
		{
			id: "al2",
			title: "Future Nostalgia",
			artist: "Dua Lipa",
			art: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300",
			year: "2020",
		},
	],
};

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
	const activeSongId = useStore(musicStore, (s) => s.currentSong?.id);

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
						className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
							activeFilter === filter
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
								<motion.div
									whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
									className="bg-[#181818] p-6 rounded-xl group relative cursor-pointer transition-colors"
								>
									<img
										src={MOCK_DATA.artists[0].image}
										className="w-24 h-24 rounded-full shadow-2xl mb-6 object-cover"
										alt=""
									/>
									<h3 className="text-3xl font-bold text-white mb-2">
										{MOCK_DATA.artists[0].name}
									</h3>
									<span className="px-3 py-1 bg-black/40 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
										{MOCK_DATA.artists[0].type}
									</span>
									<button
										type="button"
										className="absolute bottom-6 right-6 w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
									>
										<Play className="w-6 h-6 text-white fill-white ml-1" />
									</button>
								</motion.div>
							</section>

							{/* Songs List */}
							<section>
								<h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
								<div className="space-y-0.5">
									{MOCK_DATA.songs.map((song) => {
										const isCurrent = activeSongId === song.id;
										return (
											<div
												key={song.id}
												onClick={() => setCurrentSong(song)}
												className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 group cursor-pointer"
											>
												<div className="relative w-10 h-10 flex-shrink-0">
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
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
							{MOCK_DATA.artists.map((artist) => (
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
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
							{MOCK_DATA.albums.map((album) => (
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
					</section>
				)}
			</AnimatePresence>
		</div>
	);
}
