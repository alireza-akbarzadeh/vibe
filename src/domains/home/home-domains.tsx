import { lazy, Suspense } from "react";
import HeroSection from "./hero-section";

// Lazy load below-the-fold sections for optimal initial load
const LiveStatsSection = lazy(() => import("./live-stats-section"));
const TrendingContentSection = lazy(() => import("./trending-content-section"));
const GenreShowcaseSection = lazy(() => import("./genre-showcase-section"));
const FeatureShowcaseSection = lazy(() => import("./feature-showcase-section"));
const DeviceExperienceSection = lazy(
	() => import("./device-experience-section"),
);
const CTASection = lazy(() => import("./cta-Section"));

function SectionFallback({ height = "h-96" }: { height?: string }) {
	return <div className={`${height} bg-[#0a0a0a]`} />;
}

export default function Home() {
	return (
		<div className="bg-[#0a0a0a] min-h-screen">
			<HeroSection />

			<Suspense fallback={<SectionFallback />}>
				<LiveStatsSection />
			</Suspense>

			<Suspense fallback={<SectionFallback />}>
				<TrendingContentSection />
			</Suspense>

			<Suspense fallback={<SectionFallback />}>
				<GenreShowcaseSection />
			</Suspense>

			<Suspense fallback={<SectionFallback />}>
				<FeatureShowcaseSection />
			</Suspense>

			<Suspense fallback={<SectionFallback />}>
				<DeviceExperienceSection />
			</Suspense>

			<Suspense fallback={<SectionFallback height="h-64" />}>
				<CTASection />
			</Suspense>
		</div>
	);
}
