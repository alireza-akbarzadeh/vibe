import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputPassword } from "@/components/ui/forms/input-password";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { socialProviders } from "@/config/socials";
import { Http } from "@/constants/constants.ts";
import AuthLayout from "@/domains/auth/auth-layout";
import { logger } from "@/lib/logger";
import { tryCatchAsync } from "@/lib/utils";
import { usePostAuthLogin } from "@/services/endpoints/authentication/authentication.ts";

const loginFormSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(1, "Password is required"),

	rememberMe: z.boolean(),
});

export type RegisterFormValues = z.infer<typeof loginFormSchema>;

export const Route = createFileRoute("/(auth)/login")({
	component: LoginPage,
});

function LoginPage() {
	// 2. Initialize TanStack Form
	const { mutateAsync, isPending } = usePostAuthLogin();
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
		validators: {
			onSubmit: loginFormSchema,
			onChange: loginFormSchema,
			onBlur: loginFormSchema,
		},
		onSubmit: async ({ value }) => {
			const [error, result] = await tryCatchAsync(
				mutateAsync({
					data: { email: value.email, password: value.password },
				}),
			)
			if (error) {
				logger.error(error.message)
				toast.error("Failed to login. Please check your credentials.")
				throw error
			}
			if (result.code === Http.STATUS_CODE_SERVICE_SUCCESS) {
				// toast.success(`${result?.data?.first_name} Welcome back!`);
				await navigate({ to: "/movies" });
			}
		},
	})

	const emailId = useId();
	const rememberId = useId()

	return (
		<AuthLayout
			title="Welcome Back"
			subtitle="Sign in to continue your journey"
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				autoComplete="false"
				autoCorrect="false"
				noValidate
				className="space-y-5"
			>
				{/* Email Field */}
				<form.Field name="email">
					{(field) => {
						const errorMessage = field.state.meta.errors?.[0];
						const isInvalid = !!errorMessage && field.state.meta.isTouched;

						return (
							<div className="space-y-2">
								<Label
									htmlFor={emailId}
									className="text-gray-300 text-sm font-medium"
								>
									Email Address
								</Label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
									<Input
										id={emailId}
										type="email"
										placeholder="you@example.com"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={`pl-12 h-12 bg-white/5 border ${isInvalid ? "border-red-500" : "border-white/10"
											} text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all`}
									/>
								</div>
								{isInvalid && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
									>
										{errorMessage.message}
									</motion.div>
								)}
							</div>
						)
					}}
				</form.Field>

				{/* Password Field */}
				<form.Field name="password">
					{(field) => {
						const errorMessage = field.state.meta.errors?.[0];
						const isInvalid = !!errorMessage && field.state.meta.isTouched;
						return (
							<InputPassword
								errorMessage={errorMessage?.message || ""}
								isInvalid={isInvalid}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}

							/>
						)
					}}
				</form.Field>

				{/* Remember Me */}
				<form.Field name="rememberMe">
					{(field) => (
						<div className="flex items-center">
							<Checkbox
								id={rememberId}
								checked={field.state.value}
								onCheckedChange={(checked) =>
									field.handleChange(checked as boolean)
								}
								className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/20 focus:ring-offset-0"
							/>
							<label
								htmlFor={rememberId}
								className="ml-2 text-sm text-gray-400"
							>
								Remember me for 30 days
							</label>
						</div>
					)}
				</form.Field>

				{/* Submit Button */}
				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							disabled={isSubmitting || isPending}
							className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group"
						>
							{isSubmitting ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								<>
									<span>Sign In</span>
									<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
								</>
							)}
						</Button>
					)}
				</form.Subscribe>

				{/* Divider & Socials */}
				<div className="relative my-2">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-white/10"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-4 bg-[#0a0a0a] text-gray-500">
							Or continue with
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					{socialProviders.map((social) => (
						<Button
							key={social.id}
							variant="outline"
							className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl"
						>
							<img src={social.icon} className="w-5 h-5" alt={social.name} />
							{social.name}
						</Button>
					))}
				</div>
			</form>

			<div className="mt-6 text-center">
				<p className="text-gray-400 text-sm">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
					>
						Create one free
					</Link>
				</p>
			</div>

			<div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
				<Sparkles className="w-4 h-4" />
				<span>Trusted by 50M+ streamers worldwide</span>
			</div>
		</AuthLayout>
	)
}
