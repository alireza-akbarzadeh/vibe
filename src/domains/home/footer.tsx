import { motion } from "framer-motion";
import {
	ArrowRight,
	Facebook,
	Github,
	Headphones,
	Instagram,
	Mail,
	MapPin,
	Twitter,
	Youtube,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo.tsx";
import { Link, type ValidLink } from "@/components/ui/link.tsx";

// ─── Data ─────────────────────────────────────────────────────
type FooterLinks = {
	Product: ValidLink[];
	Company: ValidLink[];
	Support: ValidLink[];
	Legal: ValidLink[];
};

const footerLinks: FooterLinks = {
	Product: ["/features", "/pricing", "/download"],
	Company: ["/about", "/careers", "/blog"],
	Support: ["/help-center", "/contact", "/community"],
	Legal: ["/privacy", "/terms", "/licenses", "/cookies"],
};

const socialLinks = [
	{
		icon: Twitter,
		href: "https://twitter.com/AAkbarzadehDev",
		label: "Twitter",
		color: "hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30",
	},
	{
		icon: Instagram,
		href: "#",
		label: "Instagram",
		color: "hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30",
	},
	{
		icon: Youtube,
		href: "#",
		label: "YouTube",
		color: "hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30",
	},
	{
		icon: Facebook,
		href: "#",
		label: "Facebook",
		color: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30",
	},
	{
		icon: Github,
		href: "#",
		label: "GitHub",
		color: "hover:bg-gray-400/20 hover:text-gray-300 hover:border-gray-400/30",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.15 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
	},
};

// ─── Newsletter Form ──────────────────────────────────────────
function NewsletterForm() {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email.trim()) {
			setSubmitted(true);
			setTimeout(() => setSubmitted(false), 3000);
			setEmail("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="relative">
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						required
						className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all"
					/>
				</div>
				<motion.button
					type="submit"
					whileHover={{ scale: 1.04 }}
					whileTap={{ scale: 0.97 }}
					className="px-5 py-3 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-lg shadow-purple-500/15"
				>
					{submitted ? (
						<>
							<motion.span
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="text-lg"
							>
								✓
							</motion.span>
							Sent!
						</>
					) : (
						<>
							Subscribe
							<ArrowRight className="w-3.5 h-3.5" />
						</>
					)}
				</motion.button>
			</div>
			{submitted && (
				<motion.p
					initial={{ opacity: 0, y: -4 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-2 text-xs text-emerald-400"
				>
					Welcome aboard! Check your inbox.
				</motion.p>
			)}
		</form>
	);
}

// ─── Footer ───────────────────────────────────────────────────
export default function Footer() {
	return (
		<footer className="relative bg-[#050505] overflow-hidden">
			{/* Background effects */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px]" />
				<div className="absolute -bottom-16 right-0 w-96 h-96 bg-cyan-600/8 rounded-full blur-[150px]" />
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />
			</div>

			<motion.div
				className="relative max-w-7xl mx-auto px-6"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-80px" }}
				variants={containerVariants}
			>
				{/* ── Top: Newsletter banner ── */}
				<motion.div
					variants={itemVariants}
					className="relative py-14 border-b border-white/6"
				>
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
						<div className="max-w-md">
							<h3 className="text-white text-xl font-bold mb-2">
								Stay in the loop
							</h3>
							<p className="text-gray-500 text-sm leading-relaxed">
								New features, exclusive content, and early access — delivered
								weekly. No spam, unsubscribe anytime.
							</p>
						</div>
						<div className="w-full lg:w-auto lg:min-w-100">
							<NewsletterForm />
						</div>
					</div>
				</motion.div>

				{/* ── Middle: Links grid ── */}
				<div className="py-14 grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-12">
					{/* Brand column */}
					<motion.div className="col-span-2" variants={itemVariants}>
						<div className="mb-6">
							<Logo />
						</div>

						<p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
							The next generation streaming platform. Music and movies, unified
							in one beautiful experience.
						</p>

						{/* Social links */}
						<div className="flex gap-2">
							{socialLinks.map((social, index) => (
								<motion.a
									key={social.label}
									href={social.href}
									aria-label={social.label}
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{
										delay: 0.3 + index * 0.06,
										type: "spring",
										stiffness: 300,
										damping: 20,
									}}
									whileHover={{ y: -2 }}
									className={`p-2.5 rounded-xl bg-white/4 border border-white/6 text-gray-500 transition-all duration-300 ${social.color}`}
								>
									<social.icon className="w-4 h-4" />
								</motion.a>
							))}
						</div>
					</motion.div>

					{/* Link columns */}
					{Object.entries(footerLinks).map(
						([category, links], categoryIndex) => (
							<motion.div
								key={category}
								variants={itemVariants}
								custom={categoryIndex}
							>
								<h4 className="text-white/80 font-semibold text-xs uppercase tracking-[0.15em] mb-5">
									{category}
								</h4>
								<ul className="space-y-3">
									{links.map((link) => (
										<li key={link}>
											<Link
												to={link}
												className="text-gray-500 text-sm hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 group"
											>
												<span className="w-0 group-hover:w-2 h-px bg-linear-to-r from-purple-500 to-cyan-500 transition-all duration-300" />
												<span className="capitalize">
													{link.substring(1).replace("-", " ")}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</motion.div>
						),
					)}
				</div>

				{/* ── App Store + Contact row ── */}
				<motion.div
					variants={itemVariants}
					className="py-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-6"
				>
					{/* Contact snippets */}
					<div className="flex flex-wrap items-center gap-6 text-gray-500 text-xs">
						<span className="flex items-center gap-1.5">
							<MapPin className="w-3.5 h-3.5 text-purple-400" />
							San Francisco, CA
						</span>
						<span className="flex items-center gap-1.5">
							<Mail className="w-3.5 h-3.5 text-cyan-400" />
							hello@vibe.app
						</span>
						<span className="flex items-center gap-1.5">
							<Headphones className="w-3.5 h-3.5 text-pink-400" />
							24/7 Support
						</span>
					</div>

					{/* Store buttons */}
					<div className="flex gap-3">
						<motion.a
							href="https://www.apple.com/app-store/"
							whileHover={{ scale: 1.03, y: -1 }}
							whileTap={{ scale: 0.98 }}
							className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/12 transition-all"
						>
							<svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-300">
								<title>Apple</title>
								<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
							</svg>
							<div className="flex flex-col">
								<span className="text-[9px] text-gray-500 leading-none">
									Download on the
								</span>
								<span className="text-white text-sm font-semibold leading-tight">
									App Store
								</span>
							</div>
						</motion.a>

						<motion.a
							href="https://play.google.com/store"
							whileHover={{ scale: 1.03, y: -1 }}
							whileTap={{ scale: 0.98 }}
							className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/12 transition-all"
						>
							<svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-300">
								<title>Google Play</title>
								<path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
							</svg>
							<div className="flex flex-col">
								<span className="text-[9px] text-gray-500 leading-none">
									Get it on
								</span>
								<span className="text-white text-sm font-semibold leading-tight">
									Google Play
								</span>
							</div>
						</motion.a>
					</div>
				</motion.div>

				{/* ── Bottom bar ── */}
				<motion.div
					variants={itemVariants}
					className="py-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4"
				>
					<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-gray-600 text-xs">
						<span>© 2026 Vibe. All rights reserved.</span>
						<span className="hidden sm:block text-white/10">·</span>
						<span className="flex items-center gap-1">
							Made with{" "}
							<motion.span
								animate={{ scale: [1, 1.2, 1] }}
								transition={{
									duration: 1.5,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
								className="text-red-500"
							>
								♥
							</motion.span>{" "}
							by Alireza Akbarzadeh
						</span>
					</div>

					<div className="flex items-center gap-4 text-gray-600 text-xs">
						<Link
							to="/privacy"
							className="hover:text-gray-400 transition-colors"
						>
							Privacy
						</Link>
						<Link to="/terms" className="hover:text-gray-400 transition-colors">
							Terms
						</Link>
						<Link
							to="/cookies"
							className="hover:text-gray-400 transition-colors"
						>
							Cookies
						</Link>
					</div>
				</motion.div>
			</motion.div>
		</footer>
	);
}
