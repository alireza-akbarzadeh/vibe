import {
	CheckCircle,
	ChevronRight,
	Clock,
	DollarSign,
	Facebook,
	Globe,
	Headphones,
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	MessageCircle,
	Phone,
	Send,
	Shield,
	Twitter,
	Users,
	Youtube,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/forms/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type HandleSubmitEvent = React.FormEvent<HTMLFormElement>;

export function ContactDomain() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
		topic: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: HandleSubmitEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		await new Promise<void>((resolve) => setTimeout(resolve, 1500));

		setIsSubmitting(false);
		setIsSubmitted(true);

		// Reset after 3 seconds
		setTimeout(() => {
			setIsSubmitted(false);
			setFormData({ name: "", email: "", subject: "", message: "", topic: "" });
		}, 3000);
	};

	const contactMethods = [
		{
			icon: MessageCircle,
			title: "Live Chat",
			description: "Chat with our support team",
			action: "Start Chat",
			response: "Instant",
			color: "from-blue-600 to-cyan-600",
			available: true,
		},
		{
			icon: Mail,
			title: "Email Support",
			description: "support@vibe.com",
			action: "Send Email",
			response: "< 24 hours",
			color: "from-purple-600 to-pink-600",
			available: true,
		},
		{
			icon: Phone,
			title: "Phone Support",
			description: "+1 (555) 123-4567",
			action: "Call Now",
			response: "Mon-Fri 9am-6pm EST",
			color: "from-green-600 to-emerald-600",
			available: true,
		},
		{
			icon: Headphones,
			title: "Premium Support",
			description: "Priority assistance for Premium users",
			action: "Contact Premium",
			response: "< 1 hour",
			color: "from-amber-600 to-orange-600",
			available: true,
		},
	];

	const departments = [
		{
			icon: Users,
			title: "General Support",
			description: "Questions about your account or subscription",
			email: "support@vibe.com",
		},
		{
			icon: DollarSign,
			title: "Billing & Payments",
			description: "Payment issues and subscription management",
			email: "billing@vibe.com",
		},
		{
			icon: Shield,
			title: "Privacy & Security",
			description: "Data protection and privacy concerns",
			email: "privacy@vibe.com",
		},
		{
			icon: Zap,
			title: "Technical Issues",
			description: "App bugs and technical problems",
			email: "tech@vibe.com",
		},
		{
			icon: Users,
			title: "Business Inquiries",
			description: "Partnerships and enterprise solutions",
			email: "business@vibe.com",
		},
		{
			icon: Globe,
			title: "Press & Media",
			description: "Media inquiries and press releases",
			email: "press@vibe.com",
		},
	];

	const offices = [
		{
			city: "New York",
			country: "USA",
			address: "123 Broadway, Suite 500",
			postal: "New York, NY 10013",
			phone: "+1 (555) 123-4567",
			image:
				"https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
			coordinates: [40.7128, -74.006],
		},
		{
			city: "London",
			country: "UK",
			address: "45 Oxford Street",
			postal: "London W1D 2DZ",
			phone: "+44 20 1234 5678",
			image:
				"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
			coordinates: [51.5074, -0.1278],
		},
		{
			city: "Berlin",
			country: "Germany",
			address: "Alexanderplatz 10",
			postal: "10178 Berlin",
			phone: "+49 30 12345678",
			image:
				"https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80",
			coordinates: [52.52, 13.405],
		},
	];

	const faqs = [
		{
			question: "How quickly will I get a response?",
			answer:
				"We aim to respond to all inquiries within 24 hours. Premium members receive priority support with response times under 1 hour.",
		},
		{
			question: "Can I track my support ticket?",
			answer:
				"Yes! After submitting a ticket, you will receive a confirmation email with a tracking number and status updates.",
		},
		{
			question: "Do you offer phone support?",
			answer:
				"Phone support is available Monday-Friday, 9am-6pm EST. Live chat is available 24/7 for immediate assistance.",
		},
		{
			question: "What information should I include in my message?",
			answer:
				"Please include your account email, a detailed description of your issue, and any relevant screenshots or error messages.",
		},
	];

	return (
		<div className="min-h-screen bg-black">
			{/* Hero */}
			<section className="relative pt-32 pb-24 overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-linear-to-b from-blue-900/20 via-black to-black" />
					<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80')] bg-cover bg-center opacity-5" />
				</div>

				<div className="relative max-w-5xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-6" />
						<h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
							Get in Touch
						</h1>
						<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
							We are here to help. Choose how you would like to reach us and we
							will get back to you as soon as possible.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Contact Methods */}
			<section className="py-16 border-t border-white/5">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{contactMethods.map((method, index) => (
							<motion.div
								key={method.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className="relative group"
							>
								<div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all h-full">
									<div
										className={`w-14 h-14 rounded-xl bg-linear-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
									>
										<method.icon className="w-7 h-7 text-white" />
									</div>

									<h3 className="text-xl font-bold text-white mb-2">
										{method.title}
									</h3>
									<p className="text-gray-400 text-sm mb-4">
										{method.description}
									</p>

									<div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
										<Clock className="w-3 h-3" />
										{method.response}
									</div>

									<Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
										{method.action}
									</Button>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Main Content - Form & Departments */}
			<section className="py-24 bg-linear-to-b from-purple-900/10 to-black">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Contact Form */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
								Send us a Message
							</h2>
							<p className="text-gray-400 mb-8">
								Fill out the form below and our team will get back to you within
								24 hours.
							</p>

							{isSubmitted ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className="p-8 bg-green-500/10 border border-green-500/30 rounded-2xl text-center"
								>
									<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
									<h3 className="text-2xl font-bold text-white mb-2">
										Message Sent!
									</h3>
									<p className="text-gray-400">We will get back to you soon.</p>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<Label className="block text-sm font-medium text-gray-300 mb-2">
												Name *
											</Label>
											<Input
												required
												value={formData.name}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
												}
												placeholder="John Doe"
												className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
											/>
										</div>
										<div>
											<Label className="block text-sm font-medium text-gray-300 mb-2">
												Email *
											</Label>
											<Input
												required
												type="email"
												value={formData.email}
												onChange={(e) =>
													setFormData({ ...formData, email: e.target.value })
												}
												placeholder="john@example.com"
												className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
											/>
										</div>
									</div>

									<div>
										<Label className="block text-sm font-medium text-gray-300 mb-2">
											Topic *
										</Label>
										<Select
											value={formData.topic}
											onValueChange={(value) =>
												setFormData({ ...formData, topic: value })
											}
										>
											<SelectTrigger className="bg-white/5 border-white/10 text-white">
												<SelectValue placeholder="Select a topic" />
											</SelectTrigger>
											<SelectContent className="bg-[#1a1a1a] border-white/10">
												<SelectItem
													value="support"
													className="text-white hover:bg-white/10"
												>
													General Support
												</SelectItem>
												<SelectItem
													value="billing"
													className="text-white hover:bg-white/10"
												>
													Billing & Payments
												</SelectItem>
												<SelectItem
													value="technical"
													className="text-white hover:bg-white/10"
												>
													Technical Issue
												</SelectItem>
												<SelectItem
													value="business"
													className="text-white hover:bg-white/10"
												>
													Business Inquiry
												</SelectItem>
												<SelectItem
													value="other"
													className="text-white hover:bg-white/10"
												>
													Other
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label className="block text-sm font-medium text-gray-300 mb-2">
											Subject *
										</Label>
										<Input
											required
											value={formData.subject}
											onChange={(e) =>
												setFormData({ ...formData, subject: e.target.value })
											}
											placeholder="How can we help you?"
											className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
										/>
									</div>

									<div>
										<Label className="block text-sm font-medium text-gray-300 mb-2">
											Message *
										</Label>
										<Textarea
											required
											value={formData.message}
											onChange={(e) =>
												setFormData({ ...formData, message: e.target.value })
											}
											placeholder="Tell us more about your inquiry..."
											rows={6}
											className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
										/>
									</div>

									<Button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-6 text-lg rounded-xl"
									>
										{isSubmitting ? (
											<>
												<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
												Sending...
											</>
										) : (
											<>
												Send Message
												<Send className="w-5 h-5 ml-2" />
											</>
										)}
									</Button>
								</form>
							)}
						</motion.div>

						{/* Departments */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
								Contact by Department
							</h2>
							<p className="text-gray-400 mb-8">
								Get in touch with the right team for your specific needs.
							</p>

							<div className="space-y-4">
								{departments.map((dept, index) => (
									<motion.div
										key={dept.title}
										initial={{ opacity: 0, y: 10 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.05 }}
										className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all group cursor-pointer"
									>
										<div className="flex items-start gap-4">
											<div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
												<dept.icon className="w-5 h-5 text-white" />
											</div>
											<div className="flex-1">
												<h4 className="text-white font-semibold mb-1">
													{dept.title}
												</h4>
												<p className="text-sm text-gray-400 mb-2">
													{dept.description}
												</p>
												<a
													href={`mailto:${dept.email}`}
													className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
												>
													{dept.email}
													<ChevronRight className="w-3 h-3" />
												</a>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Office Locations */}
			<section className="py-24 border-t border-white/5">
				<div className="max-w-6xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Our Offices
						</h2>
						<p className="text-xl text-gray-400">
							Visit us at one of our global locations
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{offices.map((office, index) => (
							<motion.div
								key={office.address + office.coordinates}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className="group cursor-pointer"
							>
								<div className="relative overflow-hidden rounded-2xl mb-4">
									<img
										src={office.image}
										alt={office.city}
										className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
									<div className="absolute bottom-4 left-4">
										<h3 className="text-2xl font-bold text-white">
											{office.city}
										</h3>
										<p className="text-gray-300">{office.country}</p>
									</div>
								</div>

								<div className="space-y-2 text-gray-400">
									<div className="flex items-start gap-2">
										<MapPin className="w-5 h-5 shrink-0 text-purple-400" />
										<div>
											<p>{office.address}</p>
											<p>{office.postal}</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Phone className="w-5 h-5 text-purple-400" />
										<p>{office.phone}</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="py-24 bg-linear-to-b from-purple-900/10 to-black">
				<div className="max-w-4xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Common Questions
						</h2>
						<p className="text-xl text-gray-400">
							Quick answers to questions you may have
						</p>
					</motion.div>

					<div className="space-y-4">
						{faqs.map((faq, index) => (
							<motion.div
								key={faq.answer}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.05 }}
								className="p-6 bg-white/5 border border-white/10 rounded-xl"
							>
								<h4 className="text-lg font-semibold text-white mb-2">
									{faq.question}
								</h4>
								<p className="text-gray-400">{faq.answer}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Social Media */}
			<section className="py-24 border-t border-white/5">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Connect With Us
						</h2>
						<p className="text-xl text-gray-400 mb-8">
							Follow us on social media for the latest updates
						</p>

						<div className="flex justify-center gap-4 flex-wrap">
							{[
								{ icon: Twitter, name: "Twitter", color: "hover:bg-blue-500" },
								{
									icon: Instagram,
									name: "Instagram",
									color: "hover:bg-pink-600",
								},
								{
									icon: Facebook,
									name: "Facebook",
									color: "hover:bg-blue-600",
								},
								{
									icon: Linkedin,
									name: "LinkedIn",
									color: "hover:bg-blue-700",
								},
								{ icon: Youtube, name: "YouTube", color: "hover:bg-red-600" },
							].map((social) => (
								<motion.button
									key={social.name}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
									className={`w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ${social.color} transition-all`}
								>
									<social.icon className="w-6 h-6 text-white" />
								</motion.button>
							))}
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
