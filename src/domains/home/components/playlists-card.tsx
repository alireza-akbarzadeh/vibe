import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Typography } from "@/components/ui/typography";

interface PlayListCardProps {
	playlist: {
		id: string;
		title: string;
		tracks: number;
		image: string;
		gradient: string;
	};
	index: number;
}
export function PlayListCard(props: PlayListCardProps) {
	const { playlist, index } = props;

	return (
		<motion.div
			key={playlist.title}
			initial={{ opacity: 0, x: 50 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			className="shrink-0 w-56 snap-start group"
		>
			<Link
				to="/movies/$movieId"
				params={{ movieId: playlist.id }}
				className="relative mb-4"
			>
				<div className="aspect-square rounded-2xl overflow-hidden">
					<Image
						src={playlist.image}
						alt={playlist.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
					<div
						className={`absolute inset-0 bg-linear-to-br ${playlist.gradient} opacity-40`}
					/>
				</div>
				<Button className="absolute bottom-3 right-3 p-3 rounded-full bg-green-500 text-black shadow-lg shadow-green-500/30 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110">
					<Play className="w-5 h-5 fill-current ml-0.5" />
				</Button>
			</Link>
			<Typography.H3 className="text-white font-semibold text-lg truncate">
				{playlist.title}
			</Typography.H3>
			<Typography.P className="text-gray-500 text-sm">
				{playlist.tracks} tracks
			</Typography.P>
		</motion.div>
	);
}
