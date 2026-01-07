import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/domains/auth/auth-layout";

// 1. Define the Schema (Array of 6 strings, joined to check length)
const verifySchema = z.object({
	code: z.array(z.string().length(1)).length(6, "Full 6-digit code required"),
});

export const Route = createFileRoute("/auth/verify")({
	component: VerifyPage,
});

function VerifyPage() {
	const navigate = useNavigate();
	const [isVerified, setIsVerified] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// 2. Initialize TanStack Form
	const form = useForm({
		defaultValues: {
			code: ["", "", "", "", "", ""],
		},
		validators: {
			onChange: verifySchema,
		},
		onSubmit: async ({ value }) => {
			// Simulate verification
			await new Promise((r) => setTimeout(r, 2000));
			setIsVerified(true);

			// Redirect after success
			setTimeout(() => {
				navigate({ to: "/" });
			}, 2000);
		},
	});

	// Resend Timer logic
	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendTimer]);

	const handleInput = (index: number, value: string, field: any) => {
		if (value.length > 1) value = value[value.length - 1]; // Keep last char

		const newCode = [...field.state.value];
		newCode[index] = value;
		field.handleChange(newCode);

		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent, field: any) => {
		if (e.key === "Backspace" && !field.state.value[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	if (isVerified) {
		return (
			<AuthLayout
				title="Verification Successful!"
				subtitle="Your account has been verified"
			>
				<div className="text-center py-8">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 mb-6"
					>
						<CheckCircle2 className="w-10 h-10 text-green-400" />
					</motion.div>
					<h3 className="text-2xl font-bold text-white mb-3">All Set!</h3>
					<p className="text-gray-400 mb-6">
						Redirecting you to your dashboard...
					</p>
					<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
						<Loader2 className="w-4 h-4 animate-spin" />
						<span>Please wait</span>
					</div>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Verify Your Email"
			subtitle="We've sent a 6-digit code to your email"
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				{/* Email Display */}
				<div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-linear-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
					<div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
						<Mail className="w-5 h-5 text-purple-400" />
					</div>
					<div className="text-left">
						<p className="text-white text-sm font-medium">Code sent to</p>
						<p className="text-gray-400 text-xs">your@email.com</p>
					</div>
				</div>

				{/* OTP Inputs */}
				<form.Field name="code">
					{(field) => (
						<div>
							<div className="flex justify-center gap-3 mb-4">
								{field.state.value.map((digit, index) => (
									<Input
										key={index + digit}
										ref={(el) => (inputRefs.current[index] = el)}
										type="text"
										inputMode="numeric"
										value={digit}
										onChange={(e) => handleInput(index, e.target.value, field)}
										onKeyDown={(e) => handleKeyDown(index, e, field)}
										className="w-12 h-14 text-center text-xl font-bold bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
									/>
								))}
							</div>
							{field.state.meta.isTouched &&
								field.state.meta.errors.length > 0 && (
									<p className="text-center text-xs text-red-400 mt-2">
										Please enter the full 6-digit code
									</p>
								)}
						</div>
					)}
				</form.Field>

				{/* Submit Button */}
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
								"Verify Email"
							)}
						</Button>
					)}
				</form.Subscribe>

				{/* Resend Logic */}
				<div className="text-center">
					{resendTimer > 0 ? (
						<p className="text-sm text-gray-500">
							Resend code in{" "}
							<span className="text-purple-400 font-medium">
								{resendTimer}s
							</span>
						</p>
					) : (
						<button
							type="button"
							onClick={() => setResendTimer(60)}
							className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-2 mx-auto"
						>
							<RefreshCw className="w-4 h-4" />
							Resend Code
						</button>
					)}
				</div>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-white/10" />
					</div>
				</div>

				<div className="text-center space-y-2">
					<p className="text-gray-500 text-sm">Didn't receive the code?</p>
					<div className="flex flex-col gap-2 text-sm">
						<Link
							to="#"
							className="text-purple-400 hover:text-purple-300 transition-colors"
						>
							Check your spam folder
						</Link>
						<Link
							to="/auth/login"
							className="text-purple-400 hover:text-purple-300 transition-colors"
						>
							Use a different email
						</Link>
					</div>
				</div>
			</form>

			<div className="mt-6 text-center">
				<Link
					to="/auth/login"
					className="text-gray-400 hover:text-white text-sm transition-colors"
				>
					← Back to Login
				</Link>
			</div>
		</AuthLayout>
	);
}
