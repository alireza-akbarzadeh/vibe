/** biome-ignore-all lint/correctness/useUniqueElementIds: The ID is used for scrolling to the careers section. */

import {
	Briefcase,
	Calendar,
	ChevronRight,
	Clock,
	Code,
	Coffee,
	DollarSign,
	Filter,
	Gift,
	Globe,
	GraduationCap,
	Heart,
	Home,
	MapPin,
	Music,
	Rocket,
	Search,
	Sparkles,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CareersDomain() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState("all");
	const [selectedLocation, setSelectedLocation] = useState("all");

	const departments = [
		{ id: "all", label: "All Departments", icon: Briefcase },
		{ id: "engineering", label: "Engineering", icon: Code },
		{ id: "product", label: "Product", icon: Rocket },
		{ id: "design", label: "Design", icon: Sparkles },
		{ id: "content", label: "Content", icon: Music },
		{ id: "marketing", label: "Marketing", icon: TrendingUp },
		{ id: "operations", label: "Operations", icon: Users },
	];

	const locations = [
		{ id: "all", label: "All Locations" },
		{ id: "remote", label: "Remote" },
		{ id: "new-york", label: "New York, NY" },
		{ id: "san-francisco", label: "San Francisco, CA" },
		{ id: "london", label: "London, UK" },
		{ id: "berlin", label: "Berlin, Germany" },
	];

	const jobs = [
		{
			id: 1,
			title: "Senior Full Stack Engineer",
			department: "engineering",
			location: "Remote",
			type: "Full-time",
			description:
				"Build scalable systems that power millions of streams daily",
			requirements: [
				"5+ years experience",
				"React, Node.js",
				"Cloud platforms",
			],
		},
		{
			id: 2,
			title: "Product Designer",
			department: "design",
			location: "New York, NY",
			type: "Full-time",
			description: "Create beautiful, intuitive experiences for music lovers",
			requirements: ["3+ years experience", "Figma expert", "Design systems"],
		},
		{
			id: 3,
			title: "Content Curator - Music",
			department: "content",
			location: "Remote",
			type: "Full-time",
			description: "Discover and curate the best music across all genres",
			requirements: ["Music expertise", "Editorial skills", "Trend awareness"],
		},
		{
			id: 4,
			title: "iOS Engineer",
			department: "engineering",
			location: "San Francisco, CA",
			type: "Full-time",
			description: "Shape the future of our mobile experience",
			requirements: ["Swift expertise", "4+ years iOS", "Performance focus"],
		},
		{
			id: 5,
			title: "Product Manager",
			department: "product",
			location: "London, UK",
			type: "Full-time",
			description: "Drive product strategy and execution for key features",
			requirements: ["5+ years PM", "Data-driven", "User-focused"],
		},
		{
			id: 6,
			title: "Growth Marketing Manager",
			department: "marketing",
			location: "Remote",
			type: "Full-time",
			description: "Scale user acquisition and retention strategies",
			requirements: ["Growth hacking", "Analytics", "A/B testing"],
		},
		{
			id: 7,
			title: "DevOps Engineer",
			department: "engineering",
			location: "Berlin, Germany",
			type: "Full-time",
			description: "Build and maintain our cloud infrastructure",
			requirements: ["Kubernetes", "AWS/GCP", "CI/CD pipelines"],
		},
		{
			id: 8,
			title: "Data Analyst",
			department: "operations",
			location: "Remote",
			type: "Full-time",
			description: "Turn data into actionable insights",
			requirements: ["SQL mastery", "Python/R", "BI tools"],
		},
	];

	const values = [
		{
			icon: Heart,
			title: "Music First",
			description:
				"We are passionate about music and believe in its power to connect people",
		},
		{
			icon: Zap,
			title: "Move Fast",
			description:
				"We iterate quickly, learn from failures, and ship products users love",
		},
		{
			icon: Users,
			title: "Collaborate",
			description:
				"We work together across teams to create amazing experiences",
		},
		{
			icon: Globe,
			title: "Think Global",
			description:
				"We build for a diverse, worldwide community of music lovers",
		},
	];

	const benefits = [
		{
			icon: DollarSign,
			title: "Competitive Salary",
			description: "Market-leading compensation",
		},
		{
			icon: Heart,
			title: "Health Insurance",
			description: "Medical, dental, and vision",
		},
		{
			icon: Home,
			title: "Remote Work",
			description: "Flexible work arrangements",
		},
		{
			icon: Calendar,
			title: "Unlimited PTO",
			description: "Take time when you need it",
		},
		{
			icon: GraduationCap,
			title: "Learning Budget",
			description: "$2,000 annual education fund",
		},
		{
			icon: Gift,
			title: "Premium Account",
			description: "Free Vibe Premium for you and family",
		},
		{
			icon: Coffee,
			title: "Wellness",
			description: "Gym memberships and mental health support",
		},
		{
			icon: Rocket,
			title: "Equity",
			description: "Own a piece of the company",
		},
	];

	const stats = [
		{ value: "500+", label: "Team Members" },
		{ value: "25+", label: "Countries" },
		{ value: "100M+", label: "Users" },
		{ value: "4.8", label: "Glassdoor Rating" },
	];

	const filteredJobs = jobs.filter((job) => {
		const matchesSearch =
			job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			job.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesDepartment =
			selectedDepartment === "all" || job.department === selectedDepartment;
		const matchesLocation =
			selectedLocation === "all" ||
			job.location.toLowerCase().includes(selectedLocation.toLowerCase());
		return matchesSearch && matchesDepartment && matchesLocation;
	});

	return (
		<div className="min-h-screen bg-black">
			{/* Hero */}
			<section className="relative pt-32 pb-24 overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-linear-to-b from-purple-900/30 via-black to-black" />
					<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80')] bg-cover bg-center opacity-10" />
				</div>

				<div className="relative max-w-5xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
							<Briefcase className="w-4 h-4 text-purple-400" />
							<span className="text-sm text-purple-300">We are hiring</span>
						</div>

						<h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
							Join the Vibe
						</h1>
						<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
							Help us build the future of music and entertainment. Work with
							talented people who love what they do.
						</p>

						<div className="flex flex-wrap items-center justify-center gap-4">
							<Button
								size="lg"
								className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 rounded-full"
								onClick={() =>
									document
										.getElementById("openings")
										?.scrollIntoView({ behavior: "smooth" })
								}
							>
								View Open Positions
								<ChevronRight className="w-5 h-5 ml-2" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-white/20 text-white hover:bg-white/10 rounded-full"
							>
								Learn About Our Culture
							</Button>
						</div>
					</motion.div>
				</div>

				{/* Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="relative max-w-5xl mx-auto px-6 mt-16"
				>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat) => (
							<div key={stat.label} className="text-center">
								<div className="text-4xl md:text-5xl font-bold text-white mb-2">
									{stat.value}
								</div>
								<div className="text-gray-400">{stat.label}</div>
							</div>
						))}
					</div>
				</motion.div>
			</section>

			{/* Values */}
			<section className="py-24 border-t border-white/5">
				<div className="max-w-6xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Our Values
						</h2>
						<p className="text-xl text-gray-400">
							The principles that guide everything we do
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{values.map((value, index) => (
							<motion.div
								key={`${value.title}${index}`}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
							>
								<div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
									<value.icon className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">
									{value.title}
								</h3>
								<p className="text-gray-400">{value.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section className="py-24 bg-linear-to-b from-purple-900/10 to-black">
				<div className="max-w-6xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Benefits & Perks
						</h2>
						<p className="text-xl text-gray-400">
							We take care of our team so they can do their best work
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{benefits.map((benefit, index) => (
							<motion.div
								key={`${benefit.title}${index}`}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.05 }}
								className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all group"
							>
								<benefit.icon className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
								<h3 className="text-white font-semibold mb-1">
									{benefit.title}
								</h3>
								<p className="text-sm text-gray-400">{benefit.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Open Positions */}
			<section id="openings" className="py-24 border-t border-white/5">
				<div className="max-w-6xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Open Positions
						</h2>
						<p className="text-xl text-gray-400">
							Find your perfect role and make an impact
						</p>
					</motion.div>

					{/* Filters */}
					<div className="mb-8 space-y-4">
						{/* Search */}
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<Input
								placeholder="Search positions..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
							/>
						</div>

						{/* Department Filter */}
						<div className="flex flex-wrap gap-2">
							{departments.map((dept) => (
								<button
									key={dept.id}
									onClick={() => setSelectedDepartment(dept.id)}
									className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										selectedDepartment === dept.id
											? "bg-purple-600 text-white"
											: "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
									}`}
								>
									<dept.icon className="w-4 h-4" />
									{dept.label}
								</button>
							))}
						</div>

						{/* Location Filter */}
						<div className="flex flex-wrap gap-2">
							<Filter className="w-5 h-5 text-gray-400 mr-2" />
							{locations.map((loc) => (
								<button
									key={loc.id}
									onClick={() => setSelectedLocation(loc.id)}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										selectedLocation === loc.id
											? "bg-pink-600 text-white"
											: "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
									}`}
								>
									{loc.label}
								</button>
							))}
						</div>
					</div>

					{/* Job Listings */}
					<AnimatePresence mode="wait">
						{filteredJobs.length > 0 ? (
							<motion.div
								key="jobs"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="space-y-4"
							>
								{filteredJobs.map((job, index) => (
									<motion.div
										key={job.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.05 }}
										className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all group cursor-pointer"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
													{job.title}
												</h3>
												<p className="text-gray-400 mb-4">{job.description}</p>

												<div className="flex flex-wrap items-center gap-4 text-sm">
													<div className="flex items-center gap-2 text-gray-400">
														<MapPin className="w-4 h-4" />
														{job.location}
													</div>
													<div className="flex items-center gap-2 text-gray-400">
														<Clock className="w-4 h-4" />
														{job.type}
													</div>
													<div className="flex items-center gap-2 text-gray-400">
														<Briefcase className="w-4 h-4" />
														{
															departments.find((d) => d.id === job.department)
																?.label
														}
													</div>
												</div>

												<div className="flex flex-wrap gap-2 mt-4">
													{job.requirements.map((req) => (
														<span
															key={req}
															className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-full"
														>
															{req}
														</span>
													))}
												</div>
											</div>

											<Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full">
												Apply
												<ChevronRight className="w-4 h-4 ml-1" />
											</Button>
										</div>
									</motion.div>
								))}
							</motion.div>
						) : (
							<motion.div
								key="no-results"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="text-center py-16"
							>
								<Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-white mb-2">
									No positions found
								</h3>
								<p className="text-gray-400">
									Try adjusting your filters or search query
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</section>

			{/* CTA */}
			<section className="py-24 border-t border-white/5">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-6" />
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Do not see a perfect fit?
						</h2>
						<p className="text-xl text-gray-400 mb-8">
							We are always looking for talented individuals. Send us your
							resume and we will keep you in mind for future opportunities.
						</p>
						<Button
							size="lg"
							className="bg-white text-black hover:bg-gray-200 rounded-full px-8"
						>
							Send General Application
						</Button>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
