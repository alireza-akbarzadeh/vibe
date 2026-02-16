import { motion } from "framer-motion";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieImages } from "@/domains/movies/components";
import type { GroupedImages } from "@/orpc/models/media-asset.schema";
import { LightBox } from "../components/light-box";
import type { MovieImage } from "../movie-types";

type ActiveTabSte = "poster" | "still" | "behind" | "all" | "backdrop";

interface ImagesGalleryProps {
	images?: GroupedImages;
}

export function ImagesGallery({ images }: ImagesGalleryProps) {
	const [activeTab, setActiveTab] = useState<ActiveTabSte>("all");
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImage, setCurrentImage] = useState(0);

	// Transform API images to component format
	const allImages: MovieImage[] = [
		...(images?.backdrops.map((img) => ({
			url: `https://image.tmdb.org/t/p/w1280${img.filePath}`,
			type: "backdrop" as const,
			description: `Backdrop image - ${img.width}x${img.height}`,
		})) || []),
		...(images?.posters.map((img) => ({
			url: `https://image.tmdb.org/t/p/w780${img.filePath}`,
			type: "poster" as const,
			description: `Poster image - ${img.width}x${img.height}`,
		})) || []),
		...(images?.stills.map((img) => ({
			url: `https://image.tmdb.org/t/p/w1280${img.filePath}`,
			type: "still" as const,
			description: `Still image - ${img.width}x${img.height}`,
		})) || []),
		...(images?.logos.map((img) => ({
			url: `https://image.tmdb.org/t/p/w500${img.filePath}`,
			type: "behind" as const, // Map logos to "behind" for existing UI
			description: `Logo - ${img.width}x${img.height}`,
		})) || []),
	];

	// Show placeholder if no images
	if (!images || allImages.length === 0) {
		return (
			<section className="relative py-20 bg-linear-to-b from-[#0d0d0d] to-[#0a0a0a]">
				<div className="max-w-7xl mx-auto px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Images
					</h2>
					<p className="text-gray-400">No images available yet.</p>
				</div>
			</section>
		);
	}

	const filterImage = (value: ActiveTabSte) => {
		if (value === "all") return allImages;
		return allImages.filter((image) => image.type === value);
	};

	const openLightbox = (index: number) => {
		setCurrentImage(index);
		setLightboxOpen(true);
	};

	const navigate = (direction: "next" | "prev") => {
		const displayedImages = filterImage(activeTab);
		if (direction === "next") {
			setCurrentImage((prev) => (prev + 1) % displayedImages.length);
		} else {
			setCurrentImage(
				(prev) => (prev - 1 + displayedImages.length) % displayedImages.length,
			);
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
					</div>
					{/* Image Grid */}
					<Tabs
						value={activeTab}
						onValueChange={(value) =>
							setActiveTab(value as ActiveTabSte)
						}
						defaultValue={activeTab}
					>
						<TabsList>
							<TabsTrigger value="all">
								All ({allImages.length})
							</TabsTrigger>
							<TabsTrigger value="backdrop">
								Backdrops ({images?.backdrops.length || 0})
							</TabsTrigger>
							<TabsTrigger value="poster">
								Posters ({images?.posters.length || 0})
							</TabsTrigger>
							<TabsTrigger value="still">
								Stills ({images?.stills.length || 0})
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<MovieImages
						images={filterImage(activeTab)}
						openLightbox={openLightbox}
					/>
				</motion.div>
			</div>
			<LightBox
				src={filterImage(activeTab)[currentImage]?.url || ""}
				imageLength={filterImage(activeTab).length}
				currentImage={currentImage}
				navigate={navigate}
				setLightboxOpen={setLightboxOpen}
				lightboxOpen={lightboxOpen}
			/>
		</section>
	);
}
