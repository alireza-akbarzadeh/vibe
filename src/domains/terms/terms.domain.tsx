/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { motion } from "framer-motion";
import {
	AlertTriangle,
	CheckCircle,
	ChevronRight,
	CreditCard,
	FileText,
	Globe,
	Lock,
	Mail,
	Music,
	Scale,
	Shield,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export function TermsAndConditionsDomain() {
	const [activeSection, setActiveSection] = useState("introduction");

	const sections = [
		{ id: "introduction", title: "Introduction", icon: FileText },
		{ id: "acceptance", title: "Acceptance of Terms", icon: CheckCircle },
		{ id: "accounts", title: "Account Registration", icon: Users },
		{
			id: "subscriptions",
			title: "Subscriptions & Payments",
			icon: CreditCard,
		},
		{ id: "content", title: "User Content", icon: Music },
		{ id: "prohibited", title: "Prohibited Activities", icon: AlertTriangle },
		{ id: "intellectual", title: "Intellectual Property", icon: Shield },
		{ id: "termination", title: "Termination", icon: Lock },
		{ id: "disclaimers", title: "Disclaimers", icon: AlertTriangle },
		{ id: "liability", title: "Limitation of Liability", icon: Scale },
		{ id: "governing", title: "Governing Law", icon: Globe },
		{ id: "contact", title: "Contact", icon: Mail },
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
	}, [sections.forEach]);

	const scrollToSection = (id) => {
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
				<div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-black" />
				<div className="relative max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<FileText className="w-16 h-16 text-blue-500 mx-auto mb-6" />
						<h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
							Terms and Conditions
						</h1>
						<p className="text-xl text-gray-400 mb-6">
							Please read these terms carefully before using Vibe services
						</p>
						<p className="text-sm text-gray-500">
							Effective Date: January 29, 2026
						</p>
					</motion.div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
					{/* Sidebar */}
					<aside className="lg:col-span-1">
						<div className="lg:sticky lg:top-24">
							<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
								Quick Navigation
							</h2>
							<nav className="space-y-1">
								{sections.map((section) => (
									<button
										key={section.id}
										onClick={() => scrollToSection(section.id)}
										className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${
											activeSection === section.id
												? "bg-blue-600 text-white"
												: "text-gray-400 hover:text-white hover:bg-white/5"
										}`}
									>
										<section.icon className="w-4 h-4 flex-shrink-0" />
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
							<div className="prose prose-invert max-w-none space-y-4">
								<p className="text-gray-300 leading-relaxed">
									Welcome to Vibe. These Terms and Conditions govern your access
									to and use of our music streaming platform, including our
									website, mobile applications, and any related services
									(collectively, the "Service").
								</p>
								<p className="text-gray-300 leading-relaxed">
									By accessing or using the Service, you agree to be bound by
									these Terms. If you do not agree to these Terms, please do not
									use our Service.
								</p>
								<div className="p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl mt-6">
									<p className="text-gray-300">
										<strong className="text-white">Important:</strong> These
										Terms contain provisions that limit our liability and
										require arbitration of disputes. Please read them carefully.
									</p>
								</div>
							</div>
						</section>

						{/* Acceptance */}
						<section id="acceptance">
							<h2 className="text-3xl font-bold text-white mb-6">
								Acceptance of Terms
							</h2>
							<div className="space-y-4">
								<p className="text-gray-300 leading-relaxed">
									By using Vibe, you confirm that:
								</p>
								<div className="space-y-3">
									{[
										"You are at least 13 years old (or the age of majority in your jurisdiction)",
										"You have the legal capacity to enter into these Terms",
										"You will comply with all applicable laws and regulations",
										"All information you provide is accurate and current",
										"You will maintain the security of your account",
									].map((item, index) => (
										<div
											key={index}
											className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg"
										>
											<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
											<span className="text-gray-300">{item}</span>
										</div>
									))}
								</div>
							</div>
						</section>

						{/* Account Registration */}
						<section id="accounts">
							<h2 className="text-3xl font-bold text-white mb-6">
								Account Registration
							</h2>
							<div className="space-y-6">
								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										Creating an Account
									</h3>
									<p className="text-gray-300 leading-relaxed mb-4">
										To access certain features of the Service, you must create
										an account. You agree to:
									</p>
									<ul className="space-y-2">
										{[
											"Provide accurate, complete information during registration",
											"Keep your account information up to date",
											"Maintain the confidentiality of your password",
											"Notify us immediately of any unauthorized use",
											"Accept responsibility for all activities under your account",
										].map((item, index) => (
											<li
												key={index}
												className="flex items-start gap-3 text-gray-300"
											>
												<ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>

								<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
									<h4 className="text-white font-semibold mb-3">
										Account Sharing
									</h4>
									<p className="text-gray-300">
										Your account is personal to you. You may not share your
										account credentials with others or allow others to access
										your account, except as permitted by our Family Plan.
									</p>
								</div>
							</div>
						</section>

						{/* Subscriptions */}
						<section id="subscriptions">
							<h2 className="text-3xl font-bold text-white mb-6">
								Subscriptions and Payments
							</h2>
							<div className="space-y-6">
								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										Subscription Plans
									</h3>
									<p className="text-gray-300 leading-relaxed mb-4">
										Vibe offers both free and premium subscription plans.
										Premium subscriptions provide additional features including:
									</p>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[
											"Ad-free listening",
											"Offline downloads",
											"Higher audio quality",
											"Unlimited skips",
											"Early access to new features",
											"Priority customer support",
										].map((feature, index) => (
											<div
												key={index}
												className="p-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg"
											>
												<p className="text-white">{feature}</p>
											</div>
										))}
									</div>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										Billing
									</h3>
									<div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
										<p className="text-gray-300">
											• Subscriptions are billed in advance on a monthly or
											annual basis
										</p>
										<p className="text-gray-300">
											• Payment will be charged to your payment method at
											confirmation
										</p>
										<p className="text-gray-300">
											• Subscriptions automatically renew unless cancelled
										</p>
										<p className="text-gray-300">
											• You must cancel at least 24 hours before the renewal
											date
										</p>
										<p className="text-gray-300">
											• No refunds for partial subscription periods
										</p>
									</div>
								</div>

								<div className="p-6 bg-amber-900/20 border border-amber-500/30 rounded-xl">
									<h4 className="text-white font-semibold mb-2 flex items-center gap-2">
										<CreditCard className="w-5 h-5 text-amber-400" />
										Price Changes
									</h4>
									<p className="text-gray-300">
										We may change subscription prices at any time. We will
										provide at least 30 days notice of any price increases.
										Continued use after the price change constitutes acceptance.
									</p>
								</div>
							</div>
						</section>

						{/* User Content */}
						<section id="content">
							<h2 className="text-3xl font-bold text-white mb-6">
								User Content
							</h2>
							<div className="space-y-6">
								<p className="text-gray-300 leading-relaxed">
									You may create and share playlists, comments, reviews, and
									other content ("User Content"). By posting User Content, you
									grant Vibe:
								</p>
								<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
									<ul className="space-y-3">
										<li className="text-gray-300">
											• A worldwide, non-exclusive, royalty-free license to use,
											reproduce, and display your User Content
										</li>
										<li className="text-gray-300">
											• The right to modify and adapt User Content for technical
											compatibility
										</li>
										<li className="text-gray-300">
											• The right to share User Content with other users as you
											direct
										</li>
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										Content Standards
									</h3>
									<p className="text-gray-300 mb-4">
										Your User Content must not:
									</p>
									<div className="space-y-2">
										{[
											"Infringe intellectual property rights",
											"Contain illegal, harmful, or offensive material",
											"Include spam or promotional content",
											"Violate privacy or publicity rights",
											"Contain malware or malicious code",
										].map((item, index) => (
											<div
												key={index}
												className="flex items-start gap-3 p-3 bg-red-900/10 border border-red-500/20 rounded-lg"
											>
												<AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
												<span className="text-gray-300">{item}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</section>

						{/* Prohibited Activities */}
						<section id="prohibited">
							<h2 className="text-3xl font-bold text-white mb-6">
								Prohibited Activities
							</h2>
							<div className="space-y-4">
								<p className="text-gray-300 leading-relaxed">
									You agree not to engage in any of the following prohibited
									activities:
								</p>
								<div className="grid grid-cols-1 gap-3">
									{[
										"Using the Service for any illegal purpose",
										"Attempting to gain unauthorized access to our systems",
										"Interfering with or disrupting the Service",
										"Using automated systems to access the Service",
										"Circumventing technological protection measures",
										"Downloading content except through authorized features",
										"Sharing account credentials with unauthorized users",
										"Impersonating others or providing false information",
										"Engaging in commercial use without authorization",
										"Harvesting data from other users",
									].map((activity, index) => (
										<div
											key={index}
											className="flex items-start gap-3 p-4 bg-red-900/10 border border-red-500/20 rounded-lg"
										>
											<AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
											<span className="text-gray-300">{activity}</span>
										</div>
									))}
								</div>
							</div>
						</section>

						{/* Intellectual Property */}
						<section id="intellectual">
							<h2 className="text-3xl font-bold text-white mb-6">
								Intellectual Property Rights
							</h2>
							<div className="space-y-6">
								<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
									<h3 className="text-xl font-semibold text-white mb-3">
										Our Content
									</h3>
									<p className="text-gray-300 leading-relaxed mb-4">
										The Service and its content (including music, videos, text,
										graphics, logos, and software) are owned by Vibe and our
										licensors and protected by intellectual property laws.
									</p>
									<p className="text-gray-300 leading-relaxed">
										All trademarks, service marks, and trade names are
										proprietary to Vibe or our licensors.
									</p>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										Copyright Infringement
									</h3>
									<p className="text-gray-300 leading-relaxed mb-4">
										We respect intellectual property rights. If you believe
										content on our Service infringes your copyright, please
										contact us at:
									</p>
									<div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
										<p className="text-white">
											Email:{" "}
											<span className="text-blue-400">copyright@vibe.com</span>
										</p>
									</div>
								</div>
							</div>
						</section>

						{/* Termination */}
						<section id="termination">
							<h2 className="text-3xl font-bold text-white mb-6">
								Termination
							</h2>
							<div className="space-y-6">
								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										By You
									</h3>
									<p className="text-gray-300 leading-relaxed">
										You may cancel your account at any time through your account
										settings or by contacting customer support. Upon
										cancellation, you will lose access to premium features at
										the end of your billing period.
									</p>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-white mb-3">
										By Us
									</h3>
									<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
										<p className="text-gray-300 leading-relaxed mb-4">
											We may suspend or terminate your account if:
										</p>
										<ul className="space-y-2">
											{[
												"You violate these Terms",
												"You engage in fraudulent activity",
												"Your account remains inactive for an extended period",
												"We are required to do so by law",
												"We discontinue the Service",
											].map((reason, index) => (
												<li
													key={index}
													className="flex items-start gap-3 text-gray-300"
												>
													<Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
													<span>{reason}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</section>

						{/* Disclaimers */}
						<section id="disclaimers">
							<h2 className="text-3xl font-bold text-white mb-6">
								Disclaimers
							</h2>
							<div className="p-6 bg-amber-900/20 border border-amber-500/30 rounded-xl space-y-4">
								<p className="text-gray-300 leading-relaxed uppercase font-semibold">
									THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
									WARRANTIES OF ANY KIND.
								</p>
								<p className="text-gray-300 leading-relaxed">
									We do not warrant that the Service will be uninterrupted,
									secure, or error-free. We do not guarantee the accuracy,
									completeness, or usefulness of any content on the Service.
								</p>
								<p className="text-gray-300 leading-relaxed">
									Your use of the Service is at your own risk. We are not
									responsible for content provided by third parties or for
									damages to your device.
								</p>
							</div>
						</section>

						{/* Limitation of Liability */}
						<section id="liability">
							<h2 className="text-3xl font-bold text-white mb-6">
								Limitation of Liability
							</h2>
							<div className="space-y-4">
								<div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
									<p className="text-gray-300 leading-relaxed mb-4 uppercase font-semibold">
										TO THE MAXIMUM EXTENT PERMITTED BY LAW:
									</p>
									<ul className="space-y-3">
										<li className="text-gray-300">
											• Vibe shall not be liable for any indirect, incidental,
											special, consequential, or punitive damages
										</li>
										<li className="text-gray-300">
											• Our total liability shall not exceed the amount you paid
											to us in the 12 months before the claim
										</li>
										<li className="text-gray-300">
											• We are not liable for losses caused by your violation of
											these Terms
										</li>
										<li className="text-gray-300">
											• We are not liable for service interruptions beyond our
											control
										</li>
									</ul>
								</div>

								<div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
									<p className="text-gray-300 text-sm">
										Some jurisdictions do not allow limitation of liability, so
										these limitations may not apply to you.
									</p>
								</div>
							</div>
						</section>

						{/* Governing Law */}
						<section id="governing">
							<h2 className="text-3xl font-bold text-white mb-6">
								Governing Law and Dispute Resolution
							</h2>
							<div className="space-y-6">
								<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
									<h3 className="text-xl font-semibold text-white mb-3">
										Governing Law
									</h3>
									<p className="text-gray-300 leading-relaxed">
										These Terms are governed by the laws of the State of New
										York, United States, without regard to conflict of law
										provisions.
									</p>
								</div>

								<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
									<h3 className="text-xl font-semibold text-white mb-3">
										Dispute Resolution
									</h3>
									<p className="text-gray-300 leading-relaxed mb-4">
										Any disputes arising from these Terms shall be resolved
										through binding arbitration in accordance with the rules of
										the American Arbitration Association.
									</p>
									<p className="text-gray-300 leading-relaxed">
										You waive your right to participate in class action lawsuits
										or class-wide arbitration.
									</p>
								</div>
							</div>
						</section>

						{/* Changes to Terms */}
						<section className="pt-8 border-t border-white/10">
							<h3 className="text-2xl font-bold text-white mb-4">
								Changes to These Terms
							</h3>
							<p className="text-gray-300 leading-relaxed mb-4">
								We may modify these Terms at any time. We will notify you of
								material changes by posting the updated Terms on our Service and
								updating the "Effective Date" above.
							</p>
							<p className="text-gray-300 leading-relaxed">
								Your continued use of the Service after changes become effective
								constitutes acceptance of the modified Terms.
							</p>
						</section>

						{/* Contact */}
						<section id="contact">
							<h2 className="text-3xl font-bold text-white mb-6">
								Contact Information
							</h2>
							<div className="p-6 bg-white/5 border border-white/10 rounded-xl">
								<p className="text-gray-300 leading-relaxed mb-4">
									If you have questions about these Terms, please contact us:
								</p>
								<div className="space-y-2">
									<div className="flex items-center gap-3">
										<Mail className="w-5 h-5 text-blue-500" />
										<span className="text-white">legal@vibe.com</span>
									</div>
									<div className="flex items-center gap-3">
										<Globe className="w-5 h-5 text-blue-500" />
										<span className="text-white">www.vibe.com/contact</span>
									</div>
								</div>
							</div>
						</section>
					</main>
				</div>
			</div>
		</div>
	);
}
