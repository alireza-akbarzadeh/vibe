import { useId } from "@mantine/hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	CreditCard,
	Download,
	Gift,
	Loader2,
	Lock,
	Mail,
	Shield,
	Star,
	User,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppForm } from "@/components/ui/forms/form";
import { InputPassword } from "@/components/ui/forms/input-password";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { socialProviders } from "@/config/socials";
import { AUTH_STATUS, MSG } from "@/constants/constants";
import { PrivacyPolicyDialog } from "@/domains/auth/privacy-dialog";
import { TermsOfServiceDialog } from "@/domains/auth/terms-dialog";
import { authClient } from "@/lib/auth/auth-client";
import type { SignUpInput } from "@/lib/auth/auth-types";
import { registerFormSchema } from "./auth-schema";

const perks = [
	{
		icon: Star,
		title: "Unlimited Streaming",
		desc: "Movies, music, shows & podcasts",
	},
	{
		icon: Download,
		title: "Offline Downloads",
		desc: "Watch anywhere, anytime",
	},
	{
		icon: Shield,
		title: "Ad-Free Experience",
		desc: "Zero interruptions, pure content",
	},
	{
		icon: CreditCard,
		title: "No Credit Card",
		desc: "Start your free trial today",
	},
];

interface RegisterDomainProps {
	redirectUrl?: string;
}

export function RegisterDomain(props: RegisterDomainProps) {
	const { redirectUrl } = props;
	const [socialLoading, setSocialLoading] = useState<string | null>(null);
	const navigate = useNavigate();

	const form = useAppForm(registerFormSchema, {
		defaultValues: {
			name: "",
			email: "",
			password: "",
			agreeToTerms: false,
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
					agreeToTerms: true,
				} as SignUpInput,
				{
					onError: async ({ error }) => {
						if (error.code === AUTH_STATUS.EMAIL_ALREADY_EXISTS) {
							toast.error(
								"An account with this email already exists. Please log in.",
							);
							return;
						}
						toast.error(error.message || "Registration failed");
					},
					onSuccess: async () => {
						toast.success(
							`Dear ${value.name}, Account created! Please check your email to verify your account.`,
						);
						await navigate({
							to: "/verify-email",
							search: { email: value.email, redirectUrl },
						});
					},
				},
			);
		},
	});

	const handleSocialSignIn = async (providerId: "google" | "github") => {
		setSocialLoading(providerId);
		await authClient.signIn.social(
			{
				provider: providerId,
				callbackURL: redirectUrl || "/",
			},
			{
				onSuccess: () => setSocialLoading(null),
				onError: () => {
					setSocialLoading(null);
					toast.error("Social sign-up failed. Please try again.");
				},
			},
		);
	};

	const agreeToTermsId = useId();

	return (
		<div className="min-h-screen bg-[#050505] flex">
			{/* ─── Left: Brand Panel (hidden on mobile) ─── */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
				{/* Gradient background */}
				<div className="absolute inset-0 bg-linear-to-br from-cyan-950/50 via-[#050505] to-purple-950/60" />

				{/* Animated orbs */}
				<motion.div
					animate={{
						scale: [1, 1.15, 1],
						opacity: [0.12, 0.28, 0.12],
					}}
					transition={{
						duration: 9,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.08, 0.2, 0.08],
					}}
					transition={{
						duration: 11,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl"
				/>

				{/* Grid */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"linear-gradient(rgba(6,182,212,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.8) 1px, transparent 1px)",
						backgroundSize: "60px 60px",
					}}
				/>

				{/* Content */}
				<div className="relative z-10 max-w-md px-12">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
					>
						{/* Logo */}
						<div className="flex items-center gap-3 mb-10">
							<div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
								<Zap className="w-6 h-6 text-white" />
							</div>
							<span className="text-3xl font-bold text-white tracking-tight">
								{MSG.APP_NAME}
							</span>
						</div>

						<h2 className="text-4xl font-bold text-white leading-tight mb-4">
							Join millions
							<br />
							<span className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
								streaming
							</span>
							<br />
							right now.
						</h2>

						<p className="text-gray-400 text-lg leading-relaxed mb-10">
							Create your account in seconds and start exploring a universe of
							entertainment.
						</p>

						{/* Perks grid */}
						<div className="grid grid-cols-2 gap-4">
							{perks.map((perk, i) => (
								<motion.div
									key={perk.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
									className="p-4 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-sm"
								>
									<perk.icon className="w-5 h-5 text-cyan-400 mb-2" />
									<p className="text-sm font-medium text-white">{perk.title}</p>
									<p className="text-xs text-gray-500 mt-0.5">{perk.desc}</p>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Trial badge */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 0.6 }}
						className="mt-12 flex items-center gap-3 p-4 rounded-2xl bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/15"
					>
						<Gift className="w-6 h-6 text-purple-400 shrink-0" />
						<div>
							<p className="text-sm font-medium text-white">7-day free trial</p>
							<p className="text-xs text-gray-500">
								Full access. Cancel anytime.
							</p>
						</div>
					</motion.div>
				</div>
			</div>

			{/* ─── Right: Register Form ─── */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md"
				>
					{/* Mobile logo */}
					<div className="lg:hidden flex items-center gap-3 mb-8">
						<div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
							<Zap className="w-5 h-5 text-white" />
						</div>
						<span className="text-2xl font-bold text-white">
							{MSG.APP_NAME}
						</span>
					</div>

					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-white mb-2">
							Create your account
						</h1>
						<p className="text-gray-500">Start streaming in under a minute</p>
					</div>

					{/* Social Login */}
					<div className="space-y-3 mb-6">
						{socialProviders.map((social) => (
							<Button
								key={social.id}
								type="button"
								variant="outline"
								disabled={socialLoading !== null}
								onClick={() =>
									handleSocialSignIn(social.id as "google" | "github")
								}
								className="w-full h-12 bg-white/3 border-white/10 text-white hover:bg-white/6 rounded-xl transition-all"
							>
								{socialLoading === social.id ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<>
										<img
											src={social.icon}
											className="w-5 h-5"
											alt={social.name}
										/>
										<span className="ml-3 font-medium">
											Continue with {social.name}
										</span>
									</>
								)}
							</Button>
						))}
					</div>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-white/8" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="px-4 bg-[#050505] text-gray-600 uppercase tracking-wider font-medium">
								or register with email
							</span>
						</div>
					</div>

					{/* Form */}
					<form.Root className="space-y-4">
						<form.Field name="name" label="Name" icon={User}>
							{(field) => (
								<Input
									placeholder="Your name"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="pl-12 h-12 bg-white/3 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 rounded-xl transition-all"
								/>
							)}
						</form.Field>

						<form.Field name="email" label="Email" icon={Mail}>
							{(field) => (
								<Input
									type="email"
									placeholder="you@example.com"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="pl-12 h-12 bg-white/3 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 rounded-xl transition-all"
								/>
							)}
						</form.Field>

						<form.Field name="password">
							{(field) => (
								<InputPassword
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
									isInvalid={
										!!field.state.meta.errors?.length &&
										field.state.meta.isTouched
									}
								/>
							)}
						</form.Field>

						{/* Terms Checkbox */}
						<form.Field name="agreeToTerms">
							{(field) => (
								<div className="flex flex-col">
									<div className="flex items-center gap-2">
										<Checkbox
											id={agreeToTermsId}
											checked={field.state.value}
											onCheckedChange={(val) => field.handleChange(!!val)}
											className="border-white/20 bg-white/5 data-[state=checked]:bg-purple-600"
										/>
										<Label
											htmlFor={agreeToTermsId}
											className="text-sm text-gray-400 flex gap-1 items-center"
										>
											I agree to the <TermsOfServiceDialog /> and{" "}
											<PrivacyPolicyDialog />
										</Label>
									</div>
									{field.state.meta.errors?.length > 0 &&
										field.state.meta.isTouched && (
											<p className="text-xs text-red-400 mt-1">
												{field.state.meta.errors[0].message}
											</p>
										)}
								</div>
							)}
						</form.Field>

						{/* Global Error */}
						<form.Subscribe selector={(s) => s.errors}>
							{(errors) =>
								errors.length > 0 && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
									>
										Please fix errors before submitting
									</motion.div>
								)
							}
						</form.Subscribe>

						{/* Submit */}
						<form.Subscribe selector={(s) => s.isSubmitting}>
							{(isSubmitting) => (
								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 group mt-2"
								>
									{isSubmitting ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<>
											<span>Create Account</span>
											<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
										</>
									)}
								</Button>
							)}
						</form.Subscribe>
					</form.Root>

					{/* Footer links */}
					<div className="mt-8 space-y-4">
						<p className="text-center text-gray-500 text-sm">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
							>
								Sign in
							</Link>
						</p>

						<div className="flex items-center justify-center gap-1.5 text-gray-600 text-xs">
							<Lock className="w-3 h-3" />
							<span>Free 7-day trial · No credit card required</span>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
