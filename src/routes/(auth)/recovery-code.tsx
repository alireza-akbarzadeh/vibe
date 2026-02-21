// routes/(auth)/recovery-code.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	CheckCircle2,
	KeyRound,
	Loader2,
	Shield,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/forms/form.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/domains/auth/auth-layout";
import { authClient } from "@/lib/auth/auth-client";

const recoveryCodeSchema = z.object({
	recoveryCode: z
		.string()
		.min(8, "Recovery code must be at least 8 characters"),
});

export const Route = createFileRoute("/(auth)/recovery-code")({
	component: RecoveryCodePage,
});

function RecoveryCodePage() {
	const navigate = useNavigate();
	const [isVerified, setIsVerified] = useState(false);
	const [showNewCodes, setShowNewCodes] = useState(false);
	const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);

	const form = useAppForm(recoveryCodeSchema, {
		defaultValues: {
			recoveryCode: "",
		},
		validators: {
			onChange: recoveryCodeSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				// Verify recovery code
				const { error } = await authClient.twoFactor.verifyBackupCode({
					code: value.recoveryCode,
				});

				if (error) {
					toast.error(error.message || "Invalid recovery code");
					return;
				}

				toast.success("Recovery code verified!");
				setIsVerified(true);

				// Redirect after success
				setTimeout(() => {
					navigate({ to: "/" });
				}, 2000);
			} catch (_error) {
				toast.error("Something went wrong");
			}
		},
	});

	const recoveryId = useId();

	// Generate new backup codes (usually from settings page)
	const _generateBackupCodes = async () => {
		try {
			const { data, error } = await authClient.twoFactor.generateBackupCodes({
				password: "", // In a real app, ask for password confirmation
			});

			if (error) {
				toast.error(error.message || "Failed to generate backup codes");
				return;
			}

			setNewBackupCodes(data.backupCodes);
			setShowNewCodes(true);
			toast.success("New backup codes generated!");
		} catch (_error) {
			toast.error("Failed to generate backup codes");
		}
	};

	if (isVerified) {
		return (
			<AuthLayout
				title="Access Granted!"
				subtitle="Recovery code verified successfully"
			>
				<div className="text-center py-8">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 mb-6"
					>
						<CheckCircle2 className="w-10 h-10 text-green-400" />
					</motion.div>
					<h3 className="text-2xl font-bold text-white mb-3">Welcome Back!</h3>
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

	// Show new backup codes if generated
	if (showNewCodes && newBackupCodes.length > 0) {
		return (
			<AuthLayout
				title="New Backup Codes"
				subtitle="Save these codes in a secure place"
			>
				<div className="space-y-6">
					<div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
						<AlertCircle className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
						<p className="text-yellow-400 text-sm font-medium text-center">
							You won't see these codes again!
						</p>
						<p className="text-gray-400 text-xs text-center mt-1">
							Each code can only be used once. Store them safely.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-3 p-4 bg-black/30 rounded-xl border border-white/10 font-mono">
						{newBackupCodes.map((code, i) => (
							<div
								key={i + code}
								className="text-center text-purple-400 text-sm"
							>
								{code}
							</div>
						))}
					</div>

					<div className="flex gap-3">
						<Button
							onClick={() => {
								navigator.clipboard.writeText(newBackupCodes.join("\n"));
								toast.success("Codes copied to clipboard!");
							}}
							variant="outline"
							className="flex-1 bg-white/5 border-white/10"
						>
							Copy Codes
						</Button>
						<Button
							onClick={() => {
								const blob = new Blob([newBackupCodes.join("\n")], {
									type: "text/plain",
								});
								const url = URL.createObjectURL(blob);
								const a = document.createElement("a");
								a.href = url;
								a.download = "vibe-backup-codes.txt";
								a.click();
								URL.revokeObjectURL(url);
								toast.success("Codes downloaded!");
							}}
							variant="outline"
							className="flex-1 bg-white/5 border-white/10"
						>
							Download
						</Button>
					</div>

					<Button onClick={() => navigate({ to: "/" })} className="w-full">
						Done - Go to Dashboard
					</Button>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Recovery Code"
			subtitle="Enter one of your backup codes to access your account"
		>
			<form.Root className="space-y-6">
				{/* Warning Message */}
				<div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
					<AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
					<div className="text-left">
						<p className="text-yellow-400 text-sm font-medium mb-1">
							Lost access to your authenticator?
						</p>
						<p className="text-gray-400 text-xs">
							Enter one of the recovery codes you saved when setting up 2FA.
							Each code can only be used once.
						</p>
					</div>
				</div>

				{/* Recovery Code Input */}
				<form.Field name="recoveryCode">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={recoveryId} className="text-gray-300">
								Recovery Code
							</Label>
							<div className="relative">
								<KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
								<Input
									id={recoveryId}
									type="text"
									placeholder="XXXXX-XXXXX"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value.toUpperCase())
									}
									className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono tracking-wider"
									autoFocus
								/>
							</div>
							{field.state.meta.errors && (
								<p className="text-xs text-red-400">
									{field.state.meta.errors[0]?.message}
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
							className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
						>
							{isSubmitting ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								"Verify Recovery Code"
							)}
						</Button>
					)}
				</form.Subscribe>

				{/* Don't have codes? */}
				<div className="text-center space-y-4">
					<p className="text-gray-500 text-sm">
						Don't have your recovery codes?
					</p>

					<div className="space-y-2">
						<Link
							to="/tow-fa-setup"
							className="block text-sm text-purple-400 hover:text-purple-300 transition-colors"
						>
							Set up 2FA again
						</Link>
						<Link
							to="/support"
							className="block text-sm text-purple-400 hover:text-purple-300 transition-colors"
						>
							Contact support
						</Link>
					</div>
				</div>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-white/10" />
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="px-2 bg-background text-gray-500">or</span>
					</div>
				</div>

				{/* Try another method */}
				<div className="text-center">
					<Link
						to="/tow-fa-setup"
						className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
					>
						<Shield className="w-4 h-4" />
						Try authenticator app instead
					</Link>
				</div>
			</form.Root>

			<div className="mt-6 text-center">
				<Link
					to="/login"
					className="text-gray-400 hover:text-white text-sm transition-colors"
				>
					← Back to Login
				</Link>
			</div>
		</AuthLayout>
	);
}
