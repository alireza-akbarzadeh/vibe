import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function HomeView() {
	const trendingSongs = [
		{
			id: 1,
			title: "Miami",
			artist: "Jazzeek, reezy",
			image:
				"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80",
		},
		{
			id: 2,
			title: "syndrom stockholm",
			artist: "addworld, Haftbefehl",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
		},
		{
			id: 3,
			title: "XXX",
			artist: "LACAZETTE, Avle, Kolja Goldstein",
			image:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80",
		},
		{
			id: 4,
			title: "PIRATE FREESTYLE",
			artist: "Bone$, DJ MAC, CrashDummy",
			image:
				"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80",
		},
		{
			id: 5,
			title: "Bleib stark",
			artist: "Aymo, Ayman, Amo",
			image:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80",
		},
		{
			id: 6,
			title: "Papaouta! - Afro Soul",
			artist: "mileexymind, Chill77, Uniaps",
			image:
				"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200&q=80",
		},
		{
			id: 7,
			title: "I Smoked Away My Brain",
			artist: "A$AP Rocky, Imogen Heap, Clams Casino",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
		},
	];

	const popularArtists = [
		{
			id: 1,
			name: "David Guetta",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
		},
		{
			id: 2,
			name: "Lady Gaga",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
		},
		{
			id: 3,
			name: "Rihanna",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
		},
		{
			id: 4,
			name: "Ed Sheeran",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
		},
		{
			id: 5,
			name: "Linkin Park",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80",
		},
		{
			id: 6,
			name: "Nina Chuba",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
		},
		{
			id: 7,
			name: "Pashanim",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
		},
	];

	const popularAlbums = [
		{
			id: 1,
			title: "Album 1",
			artist: "Artist Name",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
		},
		{
			id: 2,
			title: "Album 2",
			artist: "Artist Name",
			image:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80",
		},
		{
			id: 3,
			title: "Album 3",
			artist: "Artist Name",
			image:
				"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80",
		},
		{
			id: 4,
			title: "Album 4",
			artist: "Artist Name",
			image:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80",
		},
		{
			id: 5,
			title: "Album 5",
			artist: "Artist Name",
			image:
				"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200&q=80",
		},
		{
			id: 6,
			title: "Album 6",
			artist: "Artist Name",
			image:
				"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80",
		},
		{
			id: 7,
			title: "Album 7",
			artist: "Artist Name",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
		},
	];

	return (
		<div className="min-h-screen bg-linear-to-b from-indigo-900/20 to-black pb-32">
			<div className="p-8">
				{/* Trending Songs */}
				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-white">Trending songs</h2>
						<button
							type="button"
							className="text-sm text-gray-400 hover:text-white transition-colors"
						>
							Show all
						</button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
						{trendingSongs.map((song, index) => (
							<motion.div
								key={song.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="group cursor-pointer"
							>
								<div className="relative mb-3">
									<div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
										<img
											src={song.image}
											alt={song.title}
											className="w-full h-full object-cover"
										/>
									</div>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										whileHover={{ opacity: 1, y: 0 }}
										className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all"
									>
										<Play className="w-5 h-5 text-black fill-black ml-0.5" />
									</motion.div>
								</div>
								<h3 className="text-white font-medium text-sm mb-1 truncate">
									{song.title}
								</h3>
								<p className="text-gray-400 text-xs truncate">{song.artist}</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* Popular Artists */}
				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-white">Popular artists</h2>
						<button
							type="button"
							className="text-sm text-gray-400 hover:text-white transition-colors"
						>
							Show all
						</button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
						{popularArtists.map((artist, index) => (
							<motion.div
								key={artist.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="group cursor-pointer"
							>
								<div className="relative mb-3">
									<div className="aspect-square rounded-full overflow-hidden bg-gray-800">
										<img
											src={artist.image}
											alt={artist.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										whileHover={{ opacity: 1, y: 0 }}
										className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all"
									>
										<Play className="w-5 h-5 text-black fill-black ml-0.5" />
									</motion.div>
								</div>
								<h3 className="text-white font-medium text-sm mb-1 truncate text-center">
									{artist.name}
								</h3>
								<p className="text-gray-400 text-xs truncate text-center">
									{artist.role}
								</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* Popular Albums */}
				<section>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-white">
							Popular albums and singles
						</h2>
						<button
							type="button"
							className="text-sm text-gray-400 hover:text-white transition-colors"
						>
							Show all
						</button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
						{popularAlbums.map((album, index) => (
							<motion.div
								key={album.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="group cursor-pointer"
							>
								<div className="relative mb-3">
									<div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
										<img
											src={album.image}
											alt={album.title}
											className="w-full h-full object-cover"
										/>
									</div>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										whileHover={{ opacity: 1, y: 0 }}
										className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all"
									>
										<Play className="w-5 h-5 text-black fill-black ml-0.5" />
									</motion.div>
								</div>
								<h3 className="text-white font-medium text-sm mb-1 truncate">
									{album.title}
								</h3>
								<p className="text-gray-400 text-xs truncate">{album.artist}</p>
							</motion.div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
