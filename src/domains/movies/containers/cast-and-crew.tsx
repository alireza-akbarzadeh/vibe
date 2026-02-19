import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CastList } from "@/domains/movies/components";
import type { GroupedCast } from "@/orpc/models/cast.schema";

interface Person {
	person: {
		name: string;
		profilePath: string | null;
	};
	role?: string;
	job?: string;
}

export type CastMember = {
	name: string;
	character: string;
	image: string;
};

interface CastAndCrewProps {
	cast?: GroupedCast;
}

function createCastList(
	persons: Person[],
	roleExtractor: (person: Person) => string,
): CastMember[] {
	return persons.map((person) => ({
		name: person.person.name,
		character: roleExtractor(person),
		image: person.person.profilePath
			? `https://image.tmdb.org/t/p/w200${person.person.profilePath}`
			: `https://ui-avatars.com/api/?name=${person.person.name}&background=random`,
	}));
}

export function CastAndCrew({ cast }: CastAndCrewProps) {
	if (!cast) {
		return null; // Or a loading/placeholder state
	}

	const actors = createCastList(
		cast.actors,
		(actor) => actor.role || "Unknown",
	);
	const directors = createCastList(cast.directors, () => "Director");
	const writers = createCastList(
		cast.writers,
		(writer) => writer.job || "Writer",
	);

	const tabs = [
		{ value: "cast", label: `Cast (${actors.length})`, data: actors },
		{
			value: "directors",
			label: `Directors (${directors.length})`,
			data: directors,
		},
		{ value: "writers", label: `Writers (${writers.length})`, data: writers },
	].filter((tab) => tab.data.length > 0);

	return (
		<section className="py-16 bg-[#0a0a0a]">
			<div className="max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
						Cast & Crew
					</h2>

					<Tabs defaultValue={tabs[0]?.value} className="w-full">
						<TabsList className="mb-6 bg-transparent p-0 border-b border-white/10 rounded-none">
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className="text-lg font-semibold text-gray-400 data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none"
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>

						{tabs.map((tab) => (
							<TabsContent key={tab.value} value={tab.value}>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
									{tab.data.map((member, index) => (
										<CastList
											actor={member}
											index={index}
											key={`${tab.value}-${member.name}`}
										/>
									))}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</motion.div>
			</div>
		</section>
	);
}
