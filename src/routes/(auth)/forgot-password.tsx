import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	KeyRound,
	Loader2,
	Mail,
	Shield,
	Zap,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/forms/form.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MSG } from "@/constants/constants";
import { requestPasswordReset } from "@/lib/auth/auth-client";

const forgotPasswordSchema = z.object({
	email: z.email("Please enter a valid email address"),
});

export const Route = createFileRoute("/(auth)/forgot-password")({
	component: ForgotPasswordPage,
	validateSearch: (search: Record<string, string>) => ({
		email: search.email,
	}),
});

function ForgotPasswordPage() {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const emailId = useId();
	const { email } = Route.useSearch();

	const form = useAppForm(forgotPasswordSchema, {
		defaultValues: {
			email: email,
		},
		validators: {
			onChange: forgotPasswordSchema,
			onBlur: forgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			const { error } = await requestPasswordReset({
				email: value.email || "",
				redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
			});
			if (error) {
				toast.error(error.message || "Something went wrong");
				return;
			}
			setIsSubmitted(true);
		},
	});

	return (
		<div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				{/* Logo */}
				<div className="flex items-center gap-3 mb-10 justify-center">
					<div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
						<Zap className="w-5 h-5 text-white" />
					</div>
					<span className="text-2xl font-bold text-white">{MSG.APP_NAME}</span>
				</div>

				{/* Card */}
				<div className="rounded-2xl bg-white/2 border border-white/6 p-8 backdrop-blur-sm">
					{isSubmitted ? (
						/* ── Success State ── */
						<div className="text-center">
							<motion.div
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
							>
								<Mail className="w-10 h-10 text-purple-400" />
							</motion.div>

							<h1 className="text-2xl font-bold text-white mb-2">
								Check your email
							</h1>
							<p className="text-gray-500 text-sm mb-8">
								If an account exists for that email, you will receive a link to
								create a new password shortly.
							</p>

							<Button
								asChild
								variant="outline"
								className="w-full h-12 bg-white/3 border-white/10 text-white hover:bg-white/6 rounded-xl transition-all"
							>
								<Link to="/login">Return to Login</Link>
							</Button>
						</div>
					) : (
						/* ── Form State ── */
						<>
							{/* Icon */}
							<div className="flex justify-center mb-6">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										type: "spring",
										stiffness: 200,
										damping: 15,
										delay: 0.2,
									}}
									className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500/15 to-pink-500/15 flex items-center justify-center border border-purple-500/20"
								>
									<KeyRound className="w-8 h-8 text-purple-400" />
								</motion.div>
							</div>

							{/* Header */}
							<div className="text-center mb-8">
								<h1 className="text-2xl font-bold text-white mb-2">
									Forgot password?
								</h1>
								<p className="text-gray-500 text-sm">
									No worries, we'll send you reset instructions
								</p>
							</div>

							<form.Root className="space-y-5">
								<form.Field name="email">
									{(field) => {
										const errorMessage = field.state.meta.errors?.[0];
										const isInvalid =
											!!errorMessage && field.state.meta.isTouched;

										return (
											<div className="space-y-2">
												<Label
													htmlFor={emailId}
													className="text-gray-300 text-sm font-medium"
												>
													Email Address
												</Label>
												<div className="relative">
													<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
													<Input
														id={emailId}
														type="email"
														placeholder="enter your email"
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														className={`pl-12 h-12 bg-white/3 border ${isInvalid ? "border-red-500" : "border-white/10"
															} text-white placeholder:text-gray-600 focus:border-purple-500/50 rounded-xl transition-all`}
													/>
												</div>
											</div>
										);
									}}
								</form.Field>

								<form.Subscribe selector={(s) => [s.isSubmitting, s.canSubmit]}>
									{([isSubmitting, canSubmit]) => (
										<Button
											type="submit"
											disabled={isSubmitting || !canSubmit}
											className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 group"
										>
											{isSubmitting ? (
												<Loader2 className="w-5 h-5 animate-spin" />
											) : (
												<>
													<span>Reset Password</span>
													<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
												</>
											)}
										</Button>
									)}
								</form.Subscribe>
							</form.Root>

							{/* Security note */}
							<div className="mt-6 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
								<Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
								<p className="text-xs text-gray-500 leading-relaxed">
									Reset link expires in 1 hour. We'll never ask for your
									password via email.
								</p>
							</div>
						</>
					)}
				</div>

				{/* Back to login */}
				<div className="mt-6 flex justify-center">
					<Link
						to="/login"
						className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Login
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
