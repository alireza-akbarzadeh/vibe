import { lazy, Suspense } from "react";
import HeroSection from "./hero-section";

// Lazy load below-the-fold sections for optimal initial load
const LiveStatsSection = lazy(() => import("./live-stats-section"));
const TrendingContentSection = lazy(
    () => import("./trending-content-section"),
);
const GenreShowcaseSection = lazy(() => import("./genre-showcase-section"));
const FeatureShowcaseSection = lazy(
    () => import("./feature-showcase-section"),
);
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
            {/* Hero loads eagerly — first paint */}
            <HeroSection />

            {/* Platform stats with real API data */}
            <Suspense fallback={<SectionFallback />}>
                <LiveStatsSection />
            </Suspense>

            {/* Trending / Top Rated / Latest rows */}
            <Suspense fallback={<SectionFallback />}>
                <TrendingContentSection />
            </Suspense>

            {/* Genre tabs with real content */}
            <Suspense fallback={<SectionFallback />}>
                <GenreShowcaseSection />
            </Suspense>

            {/* Feature highlights */}
            <Suspense fallback={<SectionFallback />}>
                <FeatureShowcaseSection />
            </Suspense>

            {/* Device experience showcase */}
            <Suspense fallback={<SectionFallback />}>
                <DeviceExperienceSection />
            </Suspense>

            {/* Final CTA */}
            <Suspense fallback={<SectionFallback height="h-64" />}>
                <CTASection />
            </Suspense>
        </div>
    );
}
