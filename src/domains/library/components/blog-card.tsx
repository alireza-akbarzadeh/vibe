import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { scaleIn } from "@/components/motion/motion-page.tsx";
interface Blog {
	id: string;
	title: string;
	excerpt: string;
	cover: string;
	author: string;
	authorAvatar: string;
	publishedAt: string;
	readTime: number;
	category: "music" | "movies";
}
import { formatDistanceToNow } from "@/lib/date.ts";
import { cn } from "@/lib/utils";

interface BlogCardProps {
	blog: Blog;
	variant?: "default" | "featured";
	onClick?: () => void;
}

export const BlogCard = ({
	blog,
	variant = "default",
	onClick,
}: BlogCardProps) => {
	const isFeatured = variant === "featured";

	return (
		<motion.article
			variants={scaleIn}
			whileHover={{ y: -4 }}
			className={cn(
				"group cursor-pointer",
				isFeatured && "md:grid md:grid-cols-2 gap-6",
			)}
			onClick={onClick}
		>
			{/* Image */}
			<div
				className={cn(
					"relative overflow-hidden rounded-xl",
					isFeatured ? "aspect-4/3" : "aspect-video",
				)}
			>
				<img
					src={blog.cover}
					alt={blog.title}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

				{/* Category Badge */}
				<div
					className={cn(
						"absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
						blog.category === "music"
							? "bg-accent/90 text-accent-foreground"
							: "bg-secondary/90 text-secondary-foreground",
					)}
				>
					{blog.category === "music" ? "🎵 Music" : "🎬 Movies"}
				</div>
			</div>

			{/* Content */}
			<div
				className={cn(
					"mt-4",
					isFeatured && "md:mt-0 flex flex-col justify-center",
				)}
			>
				<h3
					className={cn(
						"font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2",
						isFeatured ? "text-2xl" : "text-lg",
					)}
				>
					{blog.title}
				</h3>
				<p
					className={cn(
						"text-muted-foreground mt-2 line-clamp-2",
						isFeatured ? "text-base" : "text-sm",
					)}
				>
					{blog.excerpt}
				</p>

				{/* Meta */}
				<div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<img
							src={blog.authorAvatar}
							alt={blog.author}
							className="w-6 h-6 rounded-full object-cover"
						/>
						<span>{blog.author}</span>
					</div>
					<span className="flex items-center gap-1">
						<Clock className="w-4 h-4" />
						{blog.readTime} min read
					</span>
					<span className="hidden sm:inline">
						{formatDistanceToNow(blog.publishedAt, {
							addSuffix: true,
							includeSeconds: false,
						})}
					</span>
				</div>
			</div>
		</motion.article>
	);
};
