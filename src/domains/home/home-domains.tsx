import { lazy, Suspense } from "react";
import HeroSection from "./hero-section";

// Lazy load below-the-fold content to improve initial load performance
const ParamSection = lazy(() => import("./cta-Section"));
const DeviceExperience = lazy(() => import("./device-experience"));
const FeaturedContent = lazy(() => import("./featured-content"));
const RecommendationsShowcase = lazy(() => import("./recommendation"));
const ValueProposition = lazy(() => import("./value-proposition"));

export default function Home() {
	return (
		<div className="bg-[#0a0a0a] min-h-screen">
			<HeroSection />

			<Suspense fallback={<div className="h-96" />}>
				<ValueProposition />
			</Suspense>

			<Suspense fallback={<div className="h-96" />}>
				<RecommendationsShowcase />
			</Suspense>

			<Suspense fallback={<div className="h-96" />}>
				<FeaturedContent />
			</Suspense>

			<Suspense fallback={<div className="h-96" />}>
				<DeviceExperience />
			</Suspense>

			<Suspense fallback={<div className="h-40" />}>
				<ParamSection />
			</Suspense>
		</div>
	);
}
