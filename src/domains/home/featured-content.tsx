import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Play, Star } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Typography } from "@/components/ui/typography";
import FeaturedCard from "./components/featured-card";
import { PlayListCard } from "./components/playlists-card";

const playlists = [
	{
		id: "todays-top-hits",
		title: "Today's Top Hits",
		tracks: 50,
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
		gradient: "from-purple-600 to-pink-600",
	},
	{
		id: "chill-vibes",
		title: "Chill Vibes",
		tracks: 80,
		image:
			"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
		gradient: "from-cyan-600 to-teal-600",
	},
	{
		id: "workout-energy",
		title: "Workout Energy",
		tracks: 65,
		image:
			"https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=300&fit=crop",
		gradient: "from-orange-600 to-red-600",
	},
	{
		id: "late-night-jazz",
		title: "Late Night Jazz",
		tracks: 45,
		image:
			"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
		gradient: "from-amber-600 to-yellow-600",
	},
	{
		id: "workout-energy",
		title: "Workout Energy",
		tracks: 65,
		image:
			"https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=300&fit=crop",
		gradient: "from-orange-600 to-red-600",
	},
	{
		id: "late-night-jazz",
		title: "Late Night Jazz",
		tracks: 45,
		image:
			"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
		gradient: "from-amber-600 to-yellow-600",
	},
	{
		id: "electronic-dreams",
		title: "Electronic Dreams",
		tracks: 70,
		image:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
		gradient: "from-blue-600 to-indigo-600",
	},
];

const movies = [
	{
		id: "dune-part-two",
		title: "Dune: Part Two",
		year: 2024,
		rating: 8.8,
		duration: "2h 46m",
		image:
			"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
	},
	{
		id: "oppenheimer",
		title: "Oppenheimer",
		year: 2023,
		rating: 8.6,
		duration: "3h 1m",
		image:
			"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
	},
	{
		id: "poor-things",
		title: "Poor Things",
		year: 2023,
		rating: 8.2,
		duration: "2h 21m",
		image:
			"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
	},
	{
		id: "killers-of-the-flower-moon",
		title: "Killers of the Flower Moon",
		year: 2023,
		rating: 8.1,
		duration: "3h 26m",
		image:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
	},
	{
		id: "poor-things",
		title: "Poor Things",
		year: 2023,
		rating: 8.2,
		duration: "2h 21m",
		image:
			"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
	},
	{
		id: "killers-of-the-flower-moon",
		title: "Killers of the Flower Moon",
		year: 2023,
		rating: 8.1,
		duration: "3h 26m",
		image:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
	},
	{
		id: "poor-things",
		title: "Poor Things",
		year: 2023,
		rating: 8.2,
		duration: "2h 21m",
		image:
			"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
	},
	{
		id: "killers-of-the-flower-moon",
		title: "Killers of the Flower Moon",
		year: 2023,
		rating: 8.1,
		duration: "3h 26m",
		image:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
	},
	{
		id: "the-zone-of-interest",
		title: "The Zone of Interest",
		year: 2023,
		rating: 7.8,
		duration: "1h 45m",
		image:
			"https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=600&fit=crop",
	},
];

export default function FeaturedContent() {
	const playlistRef = useRef(null);
	const movieRef = useRef(null);

	interface ScrollableRef {
		current: HTMLDivElement | null;
	}

	type ScrollDirection = "left" | "right";

	const scroll = (ref: ScrollableRef, direction: ScrollDirection): void => {
		if (ref.current) {
			const scrollAmount = direction === "left" ? -400 : 400;
			ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<section className="relative py-32 bg-linear-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] overflow-hidden">
			<div className="max-w-7xl mx-auto px-6">
				{/* Playlists Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-24"
				>
					<div className="flex items-center justify-between mb-8">
						<div>
							<Typography.H2 className="text-3xl md:text-4xl font-bold text-white">
								Featured Playlists
							</Typography.H2>
							<Typography.P>
								Handpicked collections for every moment
							</Typography.P>
						</div>
						<div className="hidden md:flex gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => scroll(playlistRef, "left")}
								className="rounded-full bg-white/5 hover:bg-white/10 text-white"
							>
								<ChevronLeft className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => scroll(playlistRef, "right")}
								className="rounded-full bg-white/5 hover:bg-white/10 text-white"
							>
								<ChevronRight className="w-5 h-5" />
							</Button>
						</div>
					</div>

					<div
						ref={playlistRef}
						className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 snap-x snap-mandatory"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{playlists.map((playlist, index) => (
							<PlayListCard playlist={playlist} index={index} key={playlist.id} />
						))}
					</div>
				</motion.div>

				{/* Movies Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<div className="flex items-center justify-between mb-8">
						<div>
							<Typography.H2 className="text-3xl md:text-4xl font-bold text-white mb-2">
								Trending Movies
							</Typography.H2>
							<Typography.P className="text-gray-400">
								The films everyone's talking about
							</Typography.P>
						</div>
						<div className="hidden md:flex gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => scroll(movieRef, "left")}
								className="rounded-full bg-white/5 hover:bg-white/10 text-white"
							>
								<ChevronLeft className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => scroll(movieRef, "right")}
								className="rounded-full bg-white/5 hover:bg-white/10 text-white"
							>
								<ChevronRight className="w-5 h-5" />
							</Button>
						</div>
					</div>
					<div
						ref={movieRef}
						className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 snap-x snap-mandatory"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{movies.map((movie, index) => (
							<FeaturedCard movie={movie} index={index} key={movie.id} />
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
