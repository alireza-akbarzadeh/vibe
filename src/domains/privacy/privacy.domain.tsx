/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { motion } from "framer-motion";
import {
	CheckCircle,
	ChevronRight,
	Cookie,
	Database,
	Eye,
	Lock,
	Mail,
	Shield,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export function PrivacyDomain() {
	const [activeSection, setActiveSection] = useState("introduction");

	const sections = [
		{ id: "introduction", title: "Introduction", icon: Shield },
		{ id: "information", title: "Information We Collect", icon: Database },
		{ id: "usage", title: "How We Use Your Information", icon: Eye },
		{ id: "sharing", title: "Information Sharing", icon: Users },
		{ id: "security", title: "Data Security", icon: Lock },
		{ id: "cookies", title: "Cookies & Tracking", icon: Cookie },
		{ id: "rights", title: "Your Rights", icon: CheckCircle },
		{ id: "contact", title: "Contact Us", icon: Mail },
	];

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{ rootMargin: "-20% 0px -80% 0px" },
		);

		sections.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, []);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			const offset = 100;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.scrollY - offset;
			window.scrollTo({ top: offsetPosition, behavior: "smooth" });
		}
	};

	return (
		<div className="min-h-screen bg-black">
			{/* Header */}
			<section className="relative pt-32 pb-16 overflow-hidden border-b border-white/5">
				<div className="absolute inset-0 bg-linear-to-b from-purple-900/10 to-black" />
				<div className="relative max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<Shield className="w-16 h-16 text-purple-500 mx-auto mb-6" />
						<h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
							Privacy Policy
						</h1>
						<p className="text-xl text-gray-400 mb-6">
							Your privacy is important to us. Learn how we collect, use, and
							protect your data.
						</p>
						<p className="text-sm text-gray-500">
							Last updated: January 28, 2026
						</p>
					</motion.div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
					{/* Table of Contents - Sticky Sidebar */}
					<aside className="lg:col-span-1">
						<div className="lg:sticky lg:top-24">
							<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
								Contents
							</h2>
							<nav className="space-y-1">
								{sections.map((section) => (
									<button
										type="button"
										key={section.id}
										onClick={() => scrollToSection(section.id)}
										className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${
											activeSection === section.id
												? "bg-purple-600 text-white"
												: "text-gray-400 hover:text-white hover:bg-white/5"
										}`}
									>
										<section.icon className="w-4 h-4 shrink-0" />
										<span className="text-sm font-medium">{section.title}</span>
									</button>
								))}
							</nav>
						</div>
					</aside>

					{/* Content */}
					<main className="lg:col-span-3 space-y-16">
						{/* Introduction */}
						<section id="introduction">
							<h2 className="text-3xl font-bold text-white mb-6">
								Introduction
							</h2>
							<div className="prose prose-invert max-w-none">
								<p className="text-gray-300 leading-relaxed mb-4">
									Welcome to Vibe. We respect your privacy and are committed to
									protecting your personal data. This privacy policy will inform
									you about how we handle your personal data when you visit our
									platform and use our services.
								</p>
								<p className="text-gray-300 leading-relaxed mb-4">
									This policy applies to all users of Vibe, including free and
									premium subscribers, and covers both our website and mobile
									applications.
								</p>
								<div className="mt-6 p-6 bg-purple-900/20 border border-purple-500/30 rounded-xl">
									<p className="text-gray-300 leading-relaxed">
										<strong className="text-white">Key Point:</strong> We will
										never sell your personal information to third parties. Your
										data is used solely to provide and improve our services.
									</p>
								</div>
							</div>
						</section>

						{/* Information We Collect */}
						<section id="information">
							<h2 className="text-3xl font-bold text-white mb-6">
								Information We Collect
							</h2>
							<div className="space-y-6">
								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										Personal Information
									</h3>
									<ul className="space-y-2">
										{[
											"Account information (name, email address, password)",
											"Payment information (credit card details, billing address)",
											"Profile information (profile picture, preferences, playlists)",
											"Contact information for customer support",
										].map((item, index) => (
											<li
												key={index}
												className="flex items-start gap-3 text-gray-300"
											>
												<ChevronRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										Usage Information
									</h3>
									<ul className="space-y-2">
										{[
											"Listening and viewing history",
											"Search queries and browsing activity",
											"Device information (IP address, browser type, operating system)",
											"Location data (country, region)",
											"App interactions and feature usage",
										].map((item, index) => (
											<li
												key={index}
												className="flex items-start gap-3 text-gray-300"
											>
												<ChevronRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										Technical Information
									</h3>
									<ul className="space-y-2">
										{[
											"Log data and analytics",
											"Cookie data and similar technologies",
											"Network connection type",
											"Performance and diagnostic data",
										].map((item, index) => (
											<li
												key={index}
												className="flex items-start gap-3 text-gray-300"
											>
												<ChevronRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</section>

						{/* How We Use Your Information */}
						<section id="usage">
							<h2 className="text-3xl font-bold text-white mb-6">
								How We Use Your Information
							</h2>
							<div className="space-y-4">
								<p className="text-gray-300 leading-relaxed">
									We use your personal information for the following purposes:
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{[
										{
											title: "Service Delivery",
											desc: "To provide, maintain, and improve our streaming services",
										},
										{
											title: "Personalization",
											desc: "To recommend content based on your preferences and history",
										},
										{
											title: "Communication",
											desc: "To send service updates, newsletters, and promotional content",
										},
										{
											title: "Payment Processing",
											desc: "To process subscriptions and manage billing",
										},
										{
											title: "Security",
											desc: "To detect fraud and ensure platform security",
										},
										{
											title: "Analytics",
											desc: "To understand usage patterns and improve user experience",
										},
									].map((item, index) => (
										<div
											key={index}
											className="p-5 bg-white/5 border border-white/10 rounded-xl"
										>
											<h4 className="text-white font-semibold mb-2">
												{item.title}
											</h4>
											<p className="text-gray-400 text-sm">{item.desc}</p>
										</div>
									))}
								</div>
							</div>
						</section>

						{/* Information Sharing */}
						<section id="sharing">
							<h2 className="text-3xl font-bold text-white mb-6">
								Information Sharing
							</h2>
							<div className="space-y-4">
								<p className="text-gray-300 leading-relaxed">
									We may share your information in the following circumstances:
								</p>
								<div className="space-y-4">
									<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
										<h4 className="text-white font-semibold mb-2 flex items-center gap-2">
											<Users className="w-5 h-5 text-purple-500" />
											Service Providers
										</h4>
										<p className="text-gray-400">
											We share data with trusted third-party service providers
											who help us operate our platform, including payment
											processors, cloud hosting providers, and analytics
											services.
										</p>
									</div>

									<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
										<h4 className="text-white font-semibold mb-2 flex items-center gap-2">
											<Shield className="w-5 h-5 text-purple-500" />
											Legal Requirements
										</h4>
										<p className="text-gray-400">
											We may disclose information when required by law, court
											order, or government request, or to protect our rights and
											safety.
										</p>
									</div>

									<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
										<h4 className="text-white font-semibold mb-2 flex items-center gap-2">
											<Database className="w-5 h-5 text-purple-500" />
											Business Transfers
										</h4>
										<p className="text-gray-400">
											In the event of a merger, acquisition, or sale of assets,
											your information may be transferred to the new entity.
										</p>
									</div>
								</div>
							</div>
						</section>

						{/* Data Security */}
						<section id="security">
							<h2 className="text-3xl font-bold text-white mb-6">
								Data Security
							</h2>
							<div className="space-y-4">
								<p className="text-gray-300 leading-relaxed">
									We implement industry-standard security measures to protect
									your personal information:
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{[
										{
											icon: Lock,
											title: "Encryption",
											desc: "AES-256 encryption for data at rest and in transit",
										},
										{
											icon: Shield,
											title: "Secure Servers",
											desc: "PCI-DSS compliant infrastructure and data centers",
										},
										{
											icon: Eye,
											title: "Access Controls",
											desc: "Strict access controls and authentication protocols",
										},
										{
											icon: Database,
											title: "Regular Audits",
											desc: "Periodic security audits and vulnerability assessments",
										},
									].map((item, index) => (
										<div
											key={index}
											className="p-5 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl"
										>
											<item.icon className="w-8 h-8 text-purple-400 mb-3" />
											<h4 className="text-white font-semibold mb-2">
												{item.title}
											</h4>
											<p className="text-gray-400 text-sm">{item.desc}</p>
										</div>
									))}
								</div>
							</div>
						</section>

						{/* Cookies & Tracking */}
						<section id="cookies">
							<h2 className="text-3xl font-bold text-white mb-6">
								Cookies & Tracking Technologies
							</h2>
							<div className="space-y-4">
								<p className="text-gray-300 leading-relaxed">
									We use cookies and similar tracking technologies to enhance
									your experience:
								</p>
								<div className="space-y-3">
									{[
										{
											type: "Essential Cookies",
											purpose:
												"Required for platform functionality and security",
										},
										{
											type: "Performance Cookies",
											purpose:
												"Help us understand how users interact with our service",
										},
										{
											type: "Functional Cookies",
											purpose: "Remember your preferences and settings",
										},
										{
											type: "Targeting Cookies",
											purpose:
												"Deliver personalized content and advertisements",
										},
									].map((cookie, index) => (
										<div
											key={index}
											className="p-4 bg-white/5 border border-white/10 rounded-lg"
										>
											<div className="flex items-start gap-3">
												<Cookie className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
												<div>
													<h5 className="text-white font-semibold">
														{cookie.type}
													</h5>
													<p className="text-gray-400 text-sm">
														{cookie.purpose}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
								<p className="text-gray-400 text-sm mt-4">
									You can control cookies through your browser settings. Note
									that disabling certain cookies may affect platform
									functionality.
								</p>
							</div>
						</section>

						{/* Your Rights */}
						<section id="rights">
							<h2 className="text-3xl font-bold text-white mb-6">
								Your Privacy Rights
							</h2>
							<div className="space-y-4">
								<p className="text-gray-300 leading-relaxed mb-6">
									You have the following rights regarding your personal data:
								</p>
								<div className="space-y-3">
									{[
										{
											right: "Access",
											desc: "Request a copy of your personal data",
										},
										{
											right: "Correction",
											desc: "Update or correct inaccurate information",
										},
										{
											right: "Deletion",
											desc: "Request deletion of your personal data",
										},
										{
											right: "Portability",
											desc: "Receive your data in a structured, machine-readable format",
										},
										{
											right: "Objection",
											desc: "Object to processing of your data for certain purposes",
										},
										{
											right: "Restriction",
											desc: "Request restriction of processing your data",
										},
									].map((item, index) => (
										<div
											key={index}
											className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
										>
											<CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
											<div>
												<h5 className="text-white font-semibold mb-1">
													{item.right}
												</h5>
												<p className="text-gray-400 text-sm">{item.desc}</p>
											</div>
										</div>
									))}
								</div>
								<div className="mt-6 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
									<p className="text-gray-300">
										To exercise any of these rights, please contact us at{" "}
										<a
											href="mailto:privacy@vibe.com"
											className="text-blue-400 hover:underline"
										>
											privacy@vibe.com
										</a>
									</p>
								</div>
							</div>
						</section>

						{/* Contact */}
						<section id="contact">
							<h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
							<div className="space-y-4">
								<p className="text-gray-300 leading-relaxed">
									If you have any questions about this Privacy Policy or our
									data practices, please contact us:
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
										<Mail className="w-8 h-8 text-purple-500 mb-4" />
										<h4 className="text-white font-semibold mb-2">Email</h4>
										<p className="text-gray-400">privacy@vibe.com</p>
									</div>
									<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
										<Shield className="w-8 h-8 text-purple-500 mb-4" />
										<h4 className="text-white font-semibold mb-2">
											Data Protection Officer
										</h4>
										<p className="text-gray-400">dpo@vibe.com</p>
									</div>
								</div>
							</div>
						</section>

						{/* Footer Note */}
						<div className="pt-8 border-t border-white/10">
							<p className="text-sm text-gray-500 text-center">
								This privacy policy may be updated from time to time. We will
								notify you of any material changes by posting the new policy on
								this page and updating the "Last Updated" date.
							</p>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
