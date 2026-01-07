import CTASection from "./cta-Section";
import DeviceExperience from "./device-experience";
import FeaturedContent from "./featured-content";

import HeroSection from "./hero-section";
import RecommendationsShowcase from "./recommendation";
import ValueProposition from "./value-proposition";

export default function Home() {
	return (
		<div className="bg-[#0a0a0a] min-h-screen">
			<HeroSection />
			<ValueProposition />
			<RecommendationsShowcase />
			<FeaturedContent />
			<DeviceExperience />
			<CTASection />
		</div>
	);
}
