import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import {
	fadeInUp,
	MotionPage,
	staggerContainer,
} from "@/components/motion/motion-page.tsx";
import { useTopRated } from "@/hooks/useLibrary";

export const Route = createFileRoute("/(library)/library/blogs")({
	component: BlogsPage,
});

function BlogsPage() {
	const { data: topRatedData, isLoading } = useTopRated({ limit: 12 });
	const items = topRatedData?.data?.items ?? [];
	const featured = items[0];
	const rest = items.slice(1);

	return (
		<MotionPage>
			{/* Header */}
			<motion.section
				variants={fadeInUp}
				initial="initial"
				animate="animate"
				className="mb-10"
			>
				<div className="flex items-center gap-2 text-primary mb-3">
					<BookOpen className="w-5 h-5" />
					<span className="text-[10px] font-black uppercase tracking-[0.3em]">
						Editorial
					</span>
				</div>
				<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
					Articles & Highlights
				</h1>
				<p className="text-muted-foreground max-w-xl">
					Curated picks, top-rated content, and editorial
					highlights from our catalog.
				</p>
			</motion.section>

			{isLoading && (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
				</div>
			)}

			{/* Featured */}
			{!isLoading && featured && (
				<motion.section
					variants={fadeInUp}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="mb-12"
				>
					<div className="group cursor-pointer relative overflow-hidden rounded-2xl bg-zinc-900">
						<div className="grid md:grid-cols-2">
							<div className="relative aspect-video md:aspect-auto overflow-hidden">
								<img
									src={
										featured.thumbnail ||
										"/api/placeholder/800/500"
									}
									alt={featured.title}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
								/>
							</div>
							<div className="p-8 flex flex-col justify-center">
								<div className="flex items-center gap-2 mb-3">
									<Sparkles className="w-4 h-4 text-primary" />
									<span className="text-xs font-bold uppercase tracking-wider text-primary">
										Featured
									</span>
								</div>
								<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
									{featured.title}
								</h2>
								<p className="text-muted-foreground line-clamp-3">
									{featured.description ||
										"A top-rated title from our collection."}
								</p>
								<div className="mt-4 flex gap-3">
									<span className="px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full bg-primary/20 text-primary">
										{featured.type}
									</span>
									{featured.imdbRating && (
										<span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-500/20 text-yellow-400">
											IMDb {featured.imdbRating}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</motion.section>
			)}

			{/* Grid */}
			{!isLoading && rest.length > 0 && (
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{rest.map((item: any) => (
						<motion.div
							key={item.id}
							variants={fadeInUp}
							whileHover={{ y: -4 }}
							className="group cursor-pointer"
						>
							<div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900 mb-4">
								<img
									src={
										item.thumbnail ||
										"/api/placeholder/600/340"
									}
									alt={item.title}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									loading="lazy"
								/>
								<div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
									<span className="text-[9px] font-black uppercase tracking-widest text-white/80">
										{item.type}
									</span>
								</div>
							</div>
							<h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate mb-1">
								{item.title}
							</h3>
							<p className="text-sm text-muted-foreground line-clamp-2">
								{item.description ||
									"Explore this top-rated title from our collection."}
							</p>
							{item.imdbRating && (
								<p className="text-xs text-yellow-400 mt-2 font-semibold">
									IMDb {item.imdbRating}
								</p>
							)}
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Empty */}
			{!isLoading && items.length === 0 && (
				<div className="py-20 text-center">
					<BookOpen className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
					<p className="text-muted-foreground font-medium italic">
						No articles available yet. Check back soon!
					</p>
				</div>
			)}
		</MotionPage>
	);
}
