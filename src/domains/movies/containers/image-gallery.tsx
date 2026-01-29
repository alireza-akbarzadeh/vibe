import { motion } from "framer-motion";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieImages } from "@/domains/movies/components";
import { LightBox } from "../components/light-box";
import type { MovieImage } from "../movie-types";

type ActiveTabSte = "poster" | "still" | "behind" | "all";

export function ImagesGallery() {
	const [activeTab, setActiveTab] = useState<ActiveTabSte>("all");
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImage, setCurrentImage] = useState(0);

	const images: MovieImage[] = [
		{
			url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
			type: "still",
			description: "Epic desert scene from the movie",
		},
		{
			url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop",
			type: "still",
			description: "Main character walking through the sand dunes",
		},
		{
			url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop",
			type: "behind",
			description: "Director setting up a shot on the set",
		},
		{
			url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop",
			type: "still",
			description: "Intense confrontation scene between two characters",
		},
		{
			url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&h=600&fit=crop",
			type: "poster",
			description: "Official movie poster featuring the lead character",
		},
		{
			url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=600&fit=crop",
			type: "behind",
			description: "Crew members adjusting lighting on set",
		},
	];
	const filterImage = (value: ActiveTabSte) => {
		if (value === "all") return images;
		return images.filter((image) => image.type === value);
	};

	const openLightbox = (index: number) => {
		setCurrentImage(index);
		setLightboxOpen(true);
	};

	const navigate = (direction: "next" | "prev") => {
		if (direction === "next") {
			setCurrentImage((prev) => (prev + 1) % images.length);
		} else {
			setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
		}
	};

	return (
		<section className="relative py-20 bg-linear-to-b from-[#0d0d0d] to-[#0a0a0a]">
			<div className="max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-3xl md:text-4xl font-bold text-white">
							Images
						</h2>
						{/* Image Grid */}
						<Tabs
							value={activeTab}
							onValueChange={(value) =>
								setActiveTab(value as unknown as ActiveTabSte)
							}
							defaultValue={activeTab}
						>
							<TabsList className="bg-white/5">
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="still">Still</TabsTrigger>
								<TabsTrigger value="behind">Behind Scenes</TabsTrigger>
								<TabsTrigger value="poster">Posters</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<MovieImages
						images={filterImage(activeTab)}
						openLightbox={openLightbox}
					/>
				</motion.div>
			</div>
			<LightBox
				src={images[currentImage].url}
				imageLength={images.length}
				currentImage={currentImage}
				navigate={navigate}
				setLightboxOpen={setLightboxOpen}
				lightboxOpen={lightboxOpen}
			/>
		</section>
	);
}
