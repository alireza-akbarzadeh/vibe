import { useId } from "@mantine/hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "@/components/ui/forms/form";
import { InputPassword } from "@/components/ui/forms/input-password";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { socialProviders } from "@/config/socials";
import { AUTH_STATUS } from "@/constants/constants";
import AuthLayout from "@/domains/auth/auth-layout";
import { PrivacyPolicyDialog } from "@/domains/auth/privacy-dialog";
import { TermsOfServiceDialog } from "@/domains/auth/terms-dialog";
import { authClient } from "@/lib/auth-client";
import { registerFormSchema } from "./auth-schema";

const benefits = [
	"Unlimited movie streaming",
	"Personalized recommendations",
	"Access on all your devices",
];

interface RegisterDomainProps {
	redirectUrl?: string;
}

export function RegisterDomain(props: RegisterDomainProps) {
	const { redirectUrl } = props;
	const navigate = useNavigate();

	const form = useForm(registerFormSchema, {
		defaultValues: {
			name: "",
			email: "",
			password: "",
			agreeToTerms: false,
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email({
				email: value.email,
				password: value.password,
				name: value.name,
				agreeToTerms: true,
			} as any, {
				onError: async ({ error }) => {
					if (error.code === AUTH_STATUS.EMAIL_ALREADY_EXISTS) {
						toast.error("An account with this email already exists. Please log in.");
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
			}
			);
		},
	});


	const handleSocialSignIn = async (providerId: "google" | "github") => {
		await authClient.signIn.social({
			provider: providerId,
			callbackURL: redirectUrl || "/",
		});
	};
	const agreeToTerms = useId();

	return (
		<AuthLayout
			title="Start Your Journey"
			subtitle="Create your account and unlock unlimited entertainment"
		>
			<form.Root className="space-y-5">
				{/* Full Name */}
				<form.Field name="name" label="Name" icon={User}>
					{(field) => (
						<Input
							placeholder="John Doe"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 rounded-xl"
						/>
					)}
				</form.Field>

				{/* Email */}
				<form.Field name="email" label="Email Address" icon={Mail}>
					{(field) => (
						<Input
							type="email"
							placeholder="you@example.com"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 rounded-xl"
						/>
					)}
				</form.Field>

				{/* Password */}
				<form.Field name="password">
					{(field) => (
						<InputPassword
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							// Assuming InputPassword handles its own internal labeling/icons
							errorMessage={field.state.meta.errors?.[0]?.message}
							isInvalid={
								!!field.state.meta.errors?.length && field.state.meta.isTouched
							}
						/>
					)}
				</form.Field>

				{/* Benefits block */}
				<div className="p-4 rounded-xl bg-linear-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
					<p className="text-white font-medium text-sm mb-3">
						What you'll get:
					</p>
					<div className="space-y-2">
						{benefits.map((benefit) => (
							<div
								key={benefit}
								className="flex items-center gap-2 text-sm text-gray-300"
							>
								<div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
									<Check className="w-3 h-3 text-green-400" />
								</div>
								<span>{benefit}</span>
							</div>
						))}
					</div>
				</div>

				{/* Terms Checkbox */}
				<form.Field name="agreeToTerms">
					{(field) => (
						<div className="flex flex-col">
							<div className="flex items-center gap-2">
								<Checkbox
									id={agreeToTerms}
									checked={field.state.value}
									onCheckedChange={(val) => field.handleChange(!!val)}
									className="border-white/20 bg-white/5 data-[state=checked]:bg-purple-600"
								/>
								<Label
									htmlFor={agreeToTerms}
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

				{/* Global Error Summary */}
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

				{/* Social Providers */}
				<div className="grid grid-cols-2 gap-3">
					{socialProviders.map((social) => (
						<Button
							key={social.id}
							type="button"
							variant="outline"
							onClick={() =>
								handleSocialSignIn(social.id as "google" | "github")
							}
							className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl"
						>
							<img src={social.icon} className="w-5 h-5" alt={social.name} />
							{social.name}
						</Button>
					))}
				</div>

				{/* Submit Button */}
				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group"
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

			{/* Footer */}
			<div className="mt-6 text-center" >
				<p className="text-gray-400 text-sm">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
					>
						Sign in
					</Link>
				</p>
			</div >

			<div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
				<Sparkles className="w-4 h-4" />
				<span>Free 7-day trial • No credit card required</span>
			</div>
		</AuthLayout >
	);
}
