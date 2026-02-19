import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	CheckCircle2,
	Loader2,
	Lock,
	Mail,
	RefreshCw,
	Shield,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/ui/forms/input-password";
import { MSG } from "@/constants/constants";
import { requestPasswordReset, resetPassword } from "@/lib/auth/auth-client";

const verifyResetSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const Route = createFileRoute("/(auth)/reset-password")({
	component: ResetPasswordVerifyPage,
	validateSearch: (search: Record<string, string>) => ({
		email: search.email,
		token: search.token,
	}),
});

function ResetPasswordVerifyPage() {
	const navigate = useNavigate();
	const { email, token } = Route.useSearch();
	const [isSuccess, setIsSuccess] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);

	const form = useForm({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		validators: {
			onChange: verifyResetSchema,
		},
		onSubmit: async ({ value }) => {
			const { error } = await resetPassword({
				newPassword: value.password,
				token: token || "",
			});

			if (error) {
				toast.error(error.message || "Invalid or expired code");
				return;
			}

			toast.success("Password reset successfully!");
			setIsSuccess(true);
			setTimeout(() => navigate({ to: "/login" }), 2000);
		},
	});

	const handleResend = async () => {
		const { error } = await requestPasswordReset({
			email: email || "",
			redirectTo: "/reset-password",
		});
		if (error) {
			toast.error(error.message || "Failed to resend reset link");
			return;
		}
		toast.success("New reset link sent! Check your email.");
		setResendTimer(60);
	};

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendTimer]);

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
					{isSuccess ? (
						/* ── Success State ── */
						<div className="text-center">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									type: "spring",
									stiffness: 200,
									damping: 15,
								}}
								className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
							>
								<CheckCircle2 className="w-10 h-10 text-emerald-400" />
							</motion.div>

							<h1 className="text-2xl font-bold text-white mb-2">
								Password reset!
							</h1>
							<p className="text-gray-500 text-sm mb-8">
								You can now log in with your new password.
							</p>

							<Button
								asChild
								className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl"
							>
								<Link to="/login">Login Now</Link>
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
									<Lock className="w-8 h-8 text-purple-400" />
								</motion.div>
							</div>

							{/* Header */}
							<div className="text-center mb-8">
								<h1 className="text-2xl font-bold text-white mb-2">
									Reset your password
								</h1>
								<p className="text-gray-500 text-sm">
									{token
										? "Enter your new password below"
										: `We sent a reset link to ${email}`}
								</p>
							</div>

							{/* Email display */}
							{email && (
								<div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 mb-6">
									<Mail className="w-4 h-4 text-purple-400" />
									<span className="text-sm text-gray-300">{email}</span>
								</div>
							)}

							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
								className="space-y-4"
							>
								<form.Field name="password">
									{(field) => (
										<InputPassword
											label="New Password"
											placeholder="••••••••"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											errorMessage={field.state.meta.errors?.[0]?.message || ""}
											isInvalid={
												!!field.state.meta.errors?.length &&
												field.state.meta.isTouched
											}
										/>
									)}
								</form.Field>

								<form.Field name="confirmPassword">
									{(field) => (
										<InputPassword
											label="Confirm Password"
											placeholder="••••••••"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											errorMessage={field.state.meta.errors?.[0]?.message || ""}
											isInvalid={
												!!field.state.meta.errors?.length &&
												field.state.meta.isTouched
											}
										/>
									)}
								</form.Field>

								{/* Submit */}
								<form.Subscribe
									selector={(state) => [state.isSubmitting, state.isValid]}
								>
									{([isSubmitting, isValid]) => (
										<Button
											type="submit"
											disabled={isSubmitting || !isValid}
											className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
										>
											{isSubmitting ? (
												<Loader2 className="w-5 h-5 animate-spin" />
											) : (
												"Reset Password"
											)}
										</Button>
									)}
								</form.Subscribe>

								{/* Resend option (no token) */}
								{email && !token && (
									<div className="text-center">
										{resendTimer > 0 ? (
											<p className="text-sm text-gray-600">
												Resend link in{" "}
												<span className="text-purple-400 font-medium font-mono">
													{resendTimer}s
												</span>
											</p>
										) : (
											<button
												type="button"
												onClick={handleResend}
												className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-2 mx-auto"
											>
												<RefreshCw className="w-4 h-4" />
												Resend reset link
											</button>
										)}
									</div>
								)}
							</form>

							{/* Security note */}
							<div className="mt-6 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
								<Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
								<p className="text-xs text-gray-500 leading-relaxed">
									Choose a strong password with at least 8 characters, including
									uppercase, lowercase, and numbers.
								</p>
							</div>
						</>
					)}
				</div>

				{/* Footer link */}
				<div className="mt-6 flex justify-center">
					<Link
						to="/forgot-password"
						search={{ email }}
						className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Use a different email
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
