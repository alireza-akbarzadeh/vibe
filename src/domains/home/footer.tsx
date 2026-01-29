import { Facebook, Instagram, Music, Twitter, Youtube } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Link, type ValidLink } from "@/components/ui/link";
import { Typography } from "@/components/ui/typography";
import { MSG } from "@/constants/constants";
import { IMAGES } from "@/constants/media";

const footerLinks = {
	Product: ["Features", "Pricing", "Apps", "Download"],
	Company: ["About", "Careers", "Press", "Blog"],
	Support: ["Help-Center", "Contact", "Community", "Status"],
	Legal: ["Privacy", "Terms", "Cookies", "Licenses"],
};

const socialLinks = [
	{ icon: Twitter, href: "http://localhost:3000/", label: "Twitter" },
	{ icon: Instagram, href: "http://localhost:3000/", label: "Instagram" },
	{ icon: Youtube, href: "http://localhost:3000/", label: "YouTube" },
	{ icon: Facebook, href: "http://localhost:3000/", label: "Facebook" },
];

export default function Footer() {
	return (
		<footer className="relative bg-[#0a0a0a] border-t border-white/5">
			<div className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
					{/* Brand */}
					<div className="col-span-2">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
								<Music className="w-5 h-5 text-white" />
							</div>
							<Typography.S className="text-xl font-bold text-white">
								{MSG.APP_NAME}
							</Typography.S>
						</div>
						<Typography.P className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
							The next generation streaming platform. Music and movies, unified
							in one beautiful experience.
						</Typography.P>

						{/* Social links */}
						<div className="flex gap-3">
							{socialLinks.map((social) => (
								<Link<ValidLink>
									// @ts-expect-error FIXME: find why
									to={social.href}
									key={social.label}
									className="p-2.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
									aria-label={social.label}
								>
									<social.icon className="w-4 h-4" />
								</Link>
							))}
						</div>
					</div>

					{/* Links */}
					{Object.entries(footerLinks).map(([category, links]) => (
						<div key={category}>
							<h3 className="text-white font-semibold mb-4">{category}</h3>
							<ul className="space-y-3">
								{links.map((link) => (
									<li key={link}>
										<Link
											// @ts-expect-error iss with links
											to={`/${link.toLowerCase()}`}
											className="text-gray-500 hover:text-white transition-colors text-sm"
										>
											{link}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom bar */}
				<div className="pt-8 border-t border-white/5">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<Typography.P className="text-gray-600 text-sm">
							© 2024 Vibe. All rights reserved.
						</Typography.P>

						<div className="flex flex-wrap gap-4">
							<Link
								to="https://www.apple.com/app-store/"
								className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group min-w-40"
							>
								<Image
									src={IMAGES.APP_STORE}
									className="w-7 h-7 object-contain group-hover:scale-110 transition-transform"
								/>
								<div className="flex flex-col items-start">
									<Typography.S className="text-[10px] uppercase tracking-wider text-gray-400 leading-none">
										Download on the
									</Typography.S>
									<Typography.P className="text-white text-base font-semibold leading-tight mt-0.5">
										App Store
									</Typography.P>
								</div>
							</Link>
							<Link
								to="https://play.google.com/store"
								className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group min-w-40"
							>
								<Image
									src={IMAGES.GOOGLE_PLAY}
									className="w-7 h-7 object-contain group-hover:scale-110 transition-transform"
								/>
								<div className="flex flex-col items-start">
									<Typography.S className="text-[10px] uppercase tracking-wider text-gray-400 leading-none">
										Get it on
									</Typography.S>
									<Typography.P className="text-white text-base font-semibold leading-tight mt-0.5">
										Google Play
									</Typography.P>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
