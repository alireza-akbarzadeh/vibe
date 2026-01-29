import { Award, DollarSign, LucideIcon, Star, TrendingUp } from "lucide-react";
import type { StatsBarProps } from "../movie-types.ts";
import { StatsCard } from "@/domains/movies/components";

export type Stats = {
	icon: LucideIcon;
	label: string;
	subtext: string;
	gradient: string;
	value: string | number;
	bgGradient: string;
};

export function StatsBar(props: StatsBarProps) {
	const { rating, votes, metascore, popularity, popularityChange, revenue } =
		props;

	const stats: Stats[] = [
		{
			icon: Star,
			label: "IMDb Rating",
			value: `${rating}/10`,
			subtext: `From ${(votes / 1000000).toFixed(1)}M users`,
			gradient: "from-yellow-500 to-amber-600",
			bgGradient: "from-yellow-500/10 to-amber-600/10",
		},
		{
			icon: Award,
			label: "Metascore",
			value: metascore,
			subtext: "Universal acclaim",
			gradient: "from-green-500 to-emerald-600",
			bgGradient: "from-green-500/10 to-emerald-600/10",
		},
		{
			icon: TrendingUp,
			label: "Popularity",
			value: `#${popularity}`,
			subtext: `+${popularityChange} from last week`,
			gradient: "from-cyan-500 to-blue-600",
			bgGradient: "from-cyan-500/10 to-blue-600/10",
		},
		{
			icon: DollarSign,
			label: "Box Office",
			value: revenue,
			subtext: "Worldwide gross",
			gradient: "from-purple-500 to-pink-600",
			bgGradient: "from-purple-500/10 to-pink-600/10",
		},
	];

	return (
		<section className="relative py-12 bg-[#0d0d0d]">
			<div className="max-w-7xl mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<StatsCard stat={stat} index={index} key={stat.label} />
					))}
				</div>
			</div>
		</section>
	);
}
