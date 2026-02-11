import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/logo.tsx";
import { Link } from "@/components/ui/link.tsx";

const footerLinks = {
	Product: ["Features", "Pricing", "Download", "Premium"],
	Company: ["About", "Careers", "Blog", "Press"],
	Support: ["Help Center", "Contact", "Community", "Status"],
	Legal: ["Privacy", "Terms", "Licenses", "Cookies"],
};

const socialLinks = [
	{
		icon: Twitter,
		href: "https://twitter.com/AAkbarzadehDev",
		label: "Twitter",
	},
	{ icon: Instagram, href: "#", label: "Instagram" },
	{ icon: Youtube, href: "#", label: "YouTube" },
	{ icon: Facebook, href: "#", label: "Facebook" },
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut" as const,
		},
	},
};

const linkHoverVariants = {
	rest: { x: 0 },
	hover: { x: 6, transition: { duration: 0.2 } },
};

export default function Footer() {
	return (
		<footer className="relative bg-background overflow-hidden">
			{/* Gradient orbs background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px]" />
				<div className="absolute -bottom-20 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-[150px]" />
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
			</div>

			<motion.div
				className="relative max-w-7xl mx-auto px-6 py-20"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-100px" }}
				variants={containerVariants}
			>
				<div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
					{/* Brand Section */}
					<motion.div className="col-span-2" variants={itemVariants}>
						<motion.div
							className="flex items-center gap-3 mb-6"
							whileHover={{ scale: 1.02 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<Logo />
						</motion.div>

						<p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">
							The next generation streaming platform. Music and movies, unified
							in one beautiful experience designed for the future.
						</p>

						{/* Social Links */}
						<div className="flex gap-3">
							{socialLinks.map((social, index) => (
								<motion.a
									key={social.label}
									href={social.href}
									className="social-icon"
									aria-label={social.label}
									whileHover={{ scale: 1.1, rotate: 5 }}
									whileTap={{ scale: 0.95 }}
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										delay: 0.3 + index * 0.1,
										type: "spring",
										stiffness: 400,
										damping: 17,
									}}
								>
									<social.icon className="w-5 h-5" />
								</motion.a>
							))}
						</div>
					</motion.div>

					{/* Footer Links */}
					{Object.entries(footerLinks).map(
						([category, links], categoryIndex) => (
							<motion.div
								key={category}
								variants={itemVariants}
								custom={categoryIndex}
							>
								<h3 className="text-foreground font-semibold mb-5 text-sm uppercase tracking-wider">
									{category}
								</h3>
								<ul className="space-y-3">
									{links.map((link) => (
										<motion.li
											key={link}
											initial="rest"
											whileHover="hover"
											animate="rest"
										>
											<motion.div variants={linkHoverVariants}>
												<Link
													to={`/${link.toLowerCase().replace(" ", "-")}`}
													className="footer-link inline-flex items-center gap-1 group"
												>
													<span className="w-0 h-px bg-gradient-to-r from-primary to-secondary group-hover:w-3 transition-all duration-300" />
													{link}
												</Link>
											</motion.div>
										</motion.li>
									))}
								</ul>
							</motion.div>
						),
					)}
				</div>

				{/* Newsletter Section */}
				<motion.div
					className="glass-card rounded-3xl p-8 mb-16"
					variants={itemVariants}
				>
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div>
							<h3 className="text-foreground text-xl font-semibold mb-2">
								Stay in the loop
							</h3>
							<p className="text-muted-foreground text-sm">
								Get the latest updates on new features and releases.
							</p>
						</div>
						<div className="flex gap-3 w-full md:w-auto">
							<motion.input
								type="email"
								placeholder="Enter your email"
								className="flex-1 md:w-72 px-5 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
								whileFocus={{ scale: 1.02 }}
							/>
							<motion.button
								className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500  text-primary-foreground font-semibold whitespace-nowrap"
								whileHover={{
									scale: 1.05,
									boxShadow: "0 0 30px hsl(270 100% 65% / 0.4)",
								}}
								whileTap={{ scale: 0.98 }}
							>
								Subscribe
							</motion.button>
						</div>
					</div>
				</motion.div>

				{/* Bottom Bar */}
				<motion.div
					className="pt-8 border-t border-border"
					variants={itemVariants}
				>
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						<div className="flex flex-col md:flex-row items-center gap-4">
							<p className="text-muted-foreground text-sm">
								© 2026 Vibe. All rights reserved.
							</p>
							<span className="hidden md:block text-border">•</span>
							<p className="text-muted-foreground text-sm flex items-center gap-1">
								Made with{" "}
								<span className="text-secondary animate-pulse">❤️</span> by
								Alireza Akbarzadeh
							</p>
						</div>

						{/* App Store Buttons */}
						<div className="flex flex-wrap gap-4">
							<motion.a
								href="https://www.apple.com/app-store/"
								className="store-button group flex gap-2"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="w-8 h-8 flex items-center justify-center">
									<svg
										viewBox="0 0 24 24"
										className="w-7 h-7 fill-foreground group-hover:fill-primary transition-colors"
									>
										<title>apple</title>
										<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
									</svg>
								</div>
								<div className="flex flex-col items-start">
									<span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
										Download on the
									</span>
									<span className="text-foreground text-base font-semibold leading-tight mt-0.5">
										App Store
									</span>
								</div>
							</motion.a>

							<motion.a
								href="https://play.google.com/store"
								className="store-button group flex gap-2 backdrop-blur-xl"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="w-8 h-8 flex items-center justify-center">
									<svg
										viewBox="0 0 24 24"
										className="w-6 h-6 fill-foreground group-hover:fill-primary transition-colors"
									>
										<title>apple</title>
										<path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
									</svg>
								</div>
								<div className="flex flex-col items-start">
									<span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
										Get it on
									</span>
									<span className="text-foreground text-base font-semibold leading-tight mt-0.5">
										Google Play
									</span>
								</div>
							</motion.a>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</footer>
	);
}
