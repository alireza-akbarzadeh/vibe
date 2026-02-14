import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	KeyRound,
	Loader2,
	Mail,
	Sparkles,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "@/components/ui/forms/form.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/domains/auth/auth-layout";

import { requestPasswordReset } from "@/lib/auth-client";

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

	const form = useForm(forgotPasswordSchema, {
		defaultValues: {
			email: email,
		},
		validators: {
			onChange: forgotPasswordSchema,
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
			setIsSubmitted(true)

		},
	});

	if (isSubmitted) {
		return (
			<AuthLayout
				title="Check Your Email"
				subtitle="We've sent password reset instructions to your inbox"
			>
				<div className="text-center py-6">
					<motion.div
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
					>
						<Mail className="w-10 h-10 text-purple-400" />
					</motion.div>

					<p className="text-gray-300 mb-8">
						If an account exists for that email, you will receive a link to
						create a new password shortly.
					</p>

					<Button
						asChild
						variant="outline"
						className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl transition-all"
					>
						<Link to="/login">Return to Login</Link>
					</Button>
				</div>
			</AuthLayout>
		);
	}

	// 4. Form View
	return (
		<AuthLayout
			title="Forgot Password?"
			subtitle="No worries, we'll send you reset instructions"
		>
			<form.Root className="space-y-6">
				<div className="flex justify-center mb-2">
					<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
						<KeyRound className="w-8 h-8 text-purple-400" />
					</div>
				</div>

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
										placeholder="enter your email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={`pl-12 h-12 bg-white/5 border ${isInvalid ? "border-red-500" : "border-white/10"
											} text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all`}
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
							className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group"
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

				<div className="text-center">
					<Link
						to="/login"
						className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Login
					</Link>
				</div>
			</form.Root>

			<div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
				<Sparkles className="w-4 h-4" />
				<span>Secure 256-bit SSL encrypted reset link</span>
			</div>
		</AuthLayout>
	);
}
