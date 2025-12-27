import { Facebook, Instagram, Music, Twitter, Youtube } from "lucide-react";

const footerLinks = {
	Product: ["Features", "Pricing", "Apps", "Download"],
	Company: ["About", "Careers", "Press", "Blog"],
	Support: ["Help Center", "Contact", "Community", "Status"],
	Legal: ["Privacy", "Terms", "Cookies", "Licenses"],
};

const socialLinks = [
	{ icon: Twitter, href: "#", label: "Twitter" },
	{ icon: Instagram, href: "#", label: "Instagram" },
	{ icon: Youtube, href: "#", label: "YouTube" },
	{ icon: Facebook, href: "#", label: "Facebook" },
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
							<span className="text-xl font-bold text-white">Vibe</span>
						</div>
						<p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
							The next generation streaming platform. Music and movies, unified
							in one beautiful experience.
						</p>

						{/* Social links */}
						<div className="flex gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									className="p-2.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
									aria-label={social.label}
								>
									<social.icon className="w-4 h-4" />
								</a>
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
										<a
											href="#"
											className="text-gray-500 hover:text-white transition-colors text-sm"
										>
											{link}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom bar */}
				<div className="pt-8 border-t border-white/5">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-gray-600 text-sm">
							© 2024 Vibe. All rights reserved.
						</p>

						{/* App store badges placeholder */}
						<div className="flex gap-4">
							<div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
								<span className="text-xs text-gray-400">Download on the</span>
								<p className="text-white text-sm font-medium">App Store</p>
							</div>
							<div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
								<span className="text-xs text-gray-400">Get it on</span>
								<p className="text-white text-sm font-medium">Google Play</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
