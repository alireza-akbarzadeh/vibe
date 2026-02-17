import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, RefreshCw, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { MSG } from "@/constants/constants";
import { authClient } from "@/lib/auth/auth-client";
import { getEmailProviderLink } from "@/lib/utils";

export const Route = createFileRoute("/(auth)/verify-email")({
	component: VerifyPage,
	validateSearch: (search: Record<string, string>) => ({
		email: search.email,
		redirectUrl:
			typeof search.redirectUrl === "string" ? search.redirectUrl : undefined,
	}),
});

function VerifyPage() {
	const { email } = Route.useSearch();
	const [resendTimer, setResendTimer] = useState(0);
	const [isResending, setIsResending] = useState(false);

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendTimer]);

	const handleResend = async () => {
		setIsResending(true);
		await authClient.sendVerificationEmail(
			{
				email: email,
				callbackURL: `${window.location.origin}/verify-email`,
			},
			{
				onSuccess: () => {
					toast.success("Fresh link sent!");
					setResendTimer(60);
				},
				onError: (ctx) => {
					toast.error(ctx.error.message || "Failed to resend");
				},
			},
		);
		setIsResending(false);
	};

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
							className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"
						>
							<Mail className="w-10 h-10 text-purple-400" />
						</motion.div>
					</div>

					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold text-white mb-2">
							Check your email
						</h1>
						<p className="text-gray-500 text-sm">
							We sent a verification link to your inbox
						</p>
					</div>

					{/* Email display */}
					<div className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/6 mb-6">
						<div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
							<Mail className="w-5 h-5 text-purple-400" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
								Sent to
							</p>
							<p className="text-sm text-gray-200 truncate">
								{email || "your email"}
							</p>
						</div>
					</div>

					{/* Direct email links */}
					{email && (
						<div className="grid grid-cols-2 gap-3 mb-6">
							<a
								href={getEmailProviderLink(email, false)}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium rounded-xl bg-white/3 border border-white/6 hover:bg-white/6 transition-all text-gray-300"
							>
								Open Inbox
							</a>
							<a
								href={getEmailProviderLink(email, true)}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium rounded-xl bg-white/3 border border-white/6 hover:bg-white/6 transition-all text-gray-300"
							>
								Check Spam
							</a>
						</div>
					)}

					{/* Resend */}
					<div className="flex flex-col items-center gap-4 mb-6">
						{resendTimer > 0 ? (
							<p className="text-xs text-gray-500">
								Resend available in{" "}
								<span className="text-purple-400 font-mono">
									{resendTimer}s
								</span>
							</p>
						) : (
							<Button
								variant="ghost"
								disabled={isResending}
								onClick={handleResend}
								className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
							>
								{isResending ? (
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
								) : (
									<RefreshCw className="w-4 h-4 mr-2" />
								)}
								Resend Verification Email
							</Button>
						)}
					</div>

					{/* Security note */}
					<div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
						<Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
						<p className="text-xs text-gray-500 leading-relaxed">
							The link expires in 24 hours. If you don't see it, check your spam
							folder or request a new one.
						</p>
					</div>
				</div>

				{/* Back to login */}
				<div className="mt-6 flex justify-center">
					<Link
						to="/login"
						className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to login
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
