import { MusicSection } from "@/domains/music/components/music-section";

// --- Main View ---
export default function HomeView() {
	const trendingSongs = [
		{
			id: 1,
			title: "Miami",
			artist: "Jazzeek, reezy",
			image:
				"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
		},
		{
			id: 2,
			title: "syndrom stockholm",
			artist: "addworld, Haftbefehl",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
		},
		{
			id: 3,
			title: "XXX",
			artist: "LACAZETTE, Avle, Kolja Goldstein",
			image:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
		},
		{
			id: 4,
			title: "PIRATE FREESTYLE",
			artist: "Bone$, DJ MAC, CrashDummy",
			image:
				"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
		},
		{
			id: 5,
			title: "Bleib stark",
			artist: "Aymo, Ayman, Amo",
			image:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
		},
		{
			id: 6,
			title: "Papaouta!",
			artist: "mileexymind, Chill77",
			image:
				"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80",
		},
		{
			id: 7,
			title: "I Smoked Away",
			artist: "A$AP Rocky, Clams Casino",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
		},
	];

	const popularArtists = [
		{
			id: 1,
			name: "David Guetta",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
		},
		{
			id: 2,
			name: "Lady Gaga",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
		},
		{
			id: 3,
			name: "Rihanna",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
		},
		{
			id: 4,
			name: "Ed Sheeran",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
		},
		{
			id: 5,
			name: "Linkin Park",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80",
		},
		{
			id: 6,
			name: "Nina Chuba",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
		},
		{
			id: 7,
			name: "Pashanim",
			role: "Artist",
			image:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
		},
	];

	return (
		<div className="min-h-screen bg-[#050505] pb-32">
			{/* Header Background Blur */}
			<div className="fixed top-0 inset-x-0 h-64 bg-linear-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />

			<div className="relative pt-8 md:p-8 max-w-400 mx-auto">
				<MusicSection title="Trending songs" items={trendingSongs} />
				<MusicSection
					title="Popular artists"
					items={popularArtists}
					variant="circle"
				/>
				<MusicSection title="Popular albums" items={trendingSongs} />{" "}
				{/* Reusing for demo */}
			</div>
		</div>
	);
}
