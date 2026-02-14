import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	CheckCircle2,
	Loader2,
	Mail,
	RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import AuthLayout from "@/domains/auth/auth-layout";
import { authClient } from "@/lib/auth-client";
import { getEmailProviderLink } from "@/lib/utils";


export const Route = createFileRoute("/(auth)/verify-email")({
	component: VerifyPage,
	validateSearch: (search: Record<string, string>) => ({
		email: search.email,
		redirectUrl: typeof search.redirectUrl === 'string' ? search.redirectUrl : undefined

	}),
});

function VerifyPage() {

	const { email, redirectUrl } = Route.useSearch();
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
		await authClient.sendVerificationEmail({
			email: email,
			callbackURL: window.location.origin + "/verify-email",
		}, {
			onSuccess: () => {
				toast.success("Fresh link sent!");
				setResendTimer(60);
			},
			onError: (ctx) => {
				toast.error(ctx.error.message || "Failed to resend");
			}
		});
		setIsResending(false);
	};


	if (status === "success") {
		return (
			<AuthLayout title="Verified!" subtitle="Taking you to your dashboard...">
				<div className="flex flex-col items-center py-10">
					<motion.div
						initial={{ scale: 0 }} animate={{ scale: 1 }}
						className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
					>
						<CheckCircle2 className="w-10 h-10 text-emerald-400" />
					</motion.div>
					<Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
				</div>
			</AuthLayout>
		);
	}

	// B. LOADING/VERIFYING STATE
	if (status === "loading") {
		return (
			<AuthLayout title="Verifying..." subtitle="Validating your secure link">
				<div className="flex flex-col items-center py-10">
					<Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
					<p className="text-sm text-gray-400">Please hold on a moment...</p>
				</div>
			</AuthLayout>
		);
	}

	// C. IDLE STATE (The "Check your email" screen)
	return (
		<AuthLayout
			title="Check your email"
			subtitle="We sent a verification link to your inbox."
		>
			<div className="space-y-6">
				<div className="space-y-6">
					<div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
						<div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
							<Mail className="w-5 h-5 text-purple-400" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sent to</p>
							<p className="text-sm text-gray-200 truncate">{email || "your email"}</p>
						</div>
					</div>

					{/* New Direct Email Links */}
					{email && (
						<div className="grid grid-cols-2 gap-3">
							<a
								href={getEmailProviderLink(email, false)}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-300"
							>
								Open Inbox
							</a>
							<a
								href={getEmailProviderLink(email, true)}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-300"
							>
								Check Spam
							</a>
						</div>
					)}
				</div>

				<div className="flex flex-col items-center gap-4">
					{resendTimer > 0 ? (
						<p className="text-xs text-gray-500">
							Resend available in <span className="text-purple-400 font-mono">{resendTimer}s</span>
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

				<div className="pt-4 border-t border-white/5 flex justify-center">
					<Link to="/login" className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
						<ArrowLeft className="w-3 h-3" />
						Back to login
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
}