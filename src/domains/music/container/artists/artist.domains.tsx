import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
	AlbumsSection,
	ArtistHero,
	FeaturedVideo,
	RelatedArtists,
	TopSongs,
} from "./components";

export type Albums = {
	id: number;
	title: string;
	year: number;
	type: string;
	tracks: number;
	cover: string;
}

export type Artist = {
	id: number;
	name: string;
	image: string;
	followers: string;
	monthlyListeners: string;
	verified: boolean;
	genres: string[];
	country: string;
	bio: {
		short: string;
		full: string;
	};
};
export type Song = {
	id: number;
	title: string;
	plays: string;
	duration: string;
	album: string;
	albumArt: string;
	isExplicit: boolean;
	artist: string
};

export function ArtistProfile() {
	const containerRef = useRef(null);
	const { scrollY } = useScroll();
	const opacity = useTransform(scrollY, [0, 300], [1, 0]);
	const scale = useTransform(scrollY, [0, 300], [1, 1.1]);


	const artist: Artist = {
		id: 1,
		name: "The Weeknd",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80",
		followers: "28.5M",
		monthlyListeners: "105M",
		verified: true,
		genres: ["R&B", "Pop", "Electronic"],
		country: "Canada",
		bio: {
			short:
				"Abel Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer.",
			full: "Abel Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer. He is noted for his unconventional music production, artistic reinventions, and signature use of the falsetto register. His accolades include 4 Grammy Awards, 20 Billboard Music Awards, 22 Juno Awards, 6 American Music Awards, 2 MTV Video Music Awards, a Latin Grammy Award, and nominations for an Academy Award and a Primetime Emmy Award.",
		},
	};

	const topSongs: Song[] = [
		{
			id: 1,
			title: "Blinding Lights",
			plays: "3.8B",
			duration: "3:20",
			album: "After Hours",
			albumArt:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
			isExplicit: false,
			artist: "The Weeknd",
		},
		{
			id: 2,
			title: "Starboy",
			plays: "2.9B",
			duration: "3:50",
			album: "Starboy",
			albumArt:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
			isExplicit: true,
			artist: "The Weeknd",
		},
		{
			id: 3,
			title: "Save Your Tears",
			plays: "2.4B",
			duration: "3:35",
			album: "After Hours",
			albumArt:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
			isExplicit: false,
			artist: "The Weeknd",
		},
		{
			id: 4,
			title: "The Hills",
			plays: "2.1B",
			duration: "4:02",
			album: "Beauty Behind the Madness",
			albumArt:
				"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
			isExplicit: true,
			artist: "The Weeknd",
		},
		{
			id: 5,
			title: "I Feel It Coming",
			plays: "1.8B",
			duration: "4:29",
			album: "Starboy",
			albumArt:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80",
			isExplicit: false,
			artist: "The Weeknd",
		},
	];

	const albums: Albums[] = [
		{
			id: 1,
			title: "After Hours",
			year: 2020,
			type: "Album",
			tracks: 14,
			cover:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
		},
		{
			id: 2,
			title: "Starboy",
			year: 2016,
			type: "Album",
			tracks: 18,
			cover:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
		},
		{
			id: 3,
			title: "Beauty Behind the Madness",
			year: 2015,
			type: "Album",
			tracks: 14,
			cover:
				"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
		},
		{
			id: 4,
			title: "Kiss Land",
			year: 2013,
			type: "Album",
			tracks: 10,
			cover:
				"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
		},
		{
			id: 5,
			title: "Trilogy",
			year: 2012,
			type: "Compilation",
			tracks: 30,
			cover:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
		},
	];

	const relatedArtists: Artist[] = [
		{
			id: 2,
			name: "Drake",
			image:
				"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
			followers: "28M",
			monthlyListeners: "80M",
			verified: true,
			genres: ["Hip-Hop", "Rap", "R&B"],
			country: "Canada",
			bio: {
				short: "Drake is a Canadian rapper, singer, and songwriter.",
				full: "Drake, born Aubrey Drake Graham, is a Canadian rapper, singer, and songwriter. He is among the world's best-selling music artists, with over 170 million records sold.",
			},
		},
		{
			id: 3,
			name: "Travis Scott",
			image:
				"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
			followers: "22M",
			monthlyListeners: "60M",
			verified: true,
			genres: ["Hip-Hop", "Rap"],
			country: "USA",
			bio: {
				short: "Travis Scott is an American rapper and producer.",
				full: "Travis Scott, born Jacques Webster II, is an American rapper, singer, songwriter, and record producer known for his unique sound and energetic performances.",
			},
		},
		{
			id: 4,
			name: "Post Malone",
			image:
				"https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&q=80",
			followers: "20M",
			monthlyListeners: "65M",
			verified: true,
			genres: ["Hip-Hop", "Pop", "Rock"],
			country: "USA",
			bio: {
				short: "Post Malone is an American rapper, singer, and songwriter.",
				full: "Post Malone, born Austin Richard Post, is an American rapper, singer, songwriter, and record producer known for blending genres and his melodic style.",
			},
		},
		{
			id: 5,
			name: "Frank Ocean",
			image:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
			followers: "15M",
			monthlyListeners: "30M",
			verified: true,
			genres: ["R&B", "Soul", "Pop"],
			country: "USA",
			bio: {
				short: "Frank Ocean is an American singer, songwriter, and rapper.",
				full: "Frank Ocean, born Christopher Edwin Breaux, is an American singer, songwriter, and rapper known for his avant-garde style and introspective lyrics.",
			},
		},
		{
			id: 6,
			name: "SZA",
			image:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
			followers: "16M",
			monthlyListeners: "50M",
			verified: true,
			genres: ["R&B", "Neo Soul"],
			country: "USA",
			bio: {
				short: "SZA is an American singer and songwriter.",
				full: "SZA, born Solána Imani Rowe, is an American singer and songwriter known for her soulful voice and genre-blending music.",
			},
		},
	];

	const featuredVideo = {
		title: "Blinding Lights (Official Video)",
		thumbnail:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
		views: "785M",
		duration: "4:20",
	};

	return (
		<div
			ref={containerRef}
			className="min-h-screen bg-[#0a0a0a] relative overflow-hidden isolate"
		>
			{/* Animated background layers */}
			<div className="absolute inset-0 pointer-events-none">
				<motion.div
					style={{ opacity, scale }}
					className="absolute inset-0 bg-linear-to-b from-purple-900/20 via-black to-black"
				/>

				{/* Dynamic gradient orbs */}
				<motion.div
					animate={{
						opacity: [0.2, 0.4, 0.2],
						x: [0, 100, 0],
						y: [0, 50, 0],
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						opacity: [0.15, 0.3, 0.15],
						x: [0, -80, 0],
						y: [0, -40, 0],
					}}
					transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-20 left-20 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl"
				/>
			</div>

			{/* Content */}
			<div className="relative z-10">
				{/* Hero Section */}
				<ArtistHero artist={artist} />

				{/* Content sections */}
				<div className="max-w-450 mx-auto px-6 space-y-16 pb-20">
					{/* Top Songs */}
					<TopSongs songs={topSongs} />

					{/* Featured Video */}
					<FeaturedVideo video={featuredVideo} />

					{/* Albums */}
					<AlbumsSection albums={albums} />

					{/* Related Artists */}
					<RelatedArtists artists={relatedArtists} />
				</div>
			</div>
		</div>
	);
}
