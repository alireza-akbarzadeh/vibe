import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	Check,
	CheckCircle2,
	ClipboardCopy,
	Download,
	Loader2,
	Shield,
	Smartphone,
	Zap,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MSG } from "@/constants/constants";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/(auth)/tow-fa-setup")({
	component: TwoFactorSetupPage,
});

// ────────────────────────────────────────────────
// Steps: enable → scan QR → verify OTP → backup codes → done
// ────────────────────────────────────────────────

type Step = "intro" | "qr" | "verify" | "backup" | "done";

function TwoFactorSetupPage() {
	const navigate = useNavigate();

	const [step, setStep] = useState<Step>("intro");
	const [isLoading, setIsLoading] = useState(false);
	const [totpURI, setTotpURI] = useState("");
	const [backupCodes, setBackupCodes] = useState<string[]>([]);
	const [otp, setOtp] = useState("");
	const [otpError, setOtpError] = useState("");
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const passwordInputId = useId();

	// ── Step 1 → 2: Enable TOTP, get QR URI ───────────────
	const handleEnable2FA = async () => {
		if (!password.trim()) {
			setPasswordError("Password is required to enable 2FA");
			return;
		}
		setPasswordError("");
		setIsLoading(true);

		const { data, error } = await authClient.twoFactor.enable({
			password,
		});

		setIsLoading(false);
		if (error) {
			toast.error(error.message || "Failed to enable 2FA");
			return;
		}

		setTotpURI(data.totpURI);
		setBackupCodes(data.backupCodes);
		setStep("qr");
	};

	// ── Step 3: Verify TOTP code ──────────────────────────
	const handleVerifyOTP = async () => {
		if (otp.length !== 6) {
			setOtpError("Enter a 6-digit code");
			return;
		}
		setOtpError("");
		setIsLoading(true);

		const { error } = await authClient.twoFactor.verifyTotp({
			code: otp,
		});

		setIsLoading(false);
		if (error) {
			setOtpError("Invalid code. Please try again.");
			return;
		}

		toast.success("Two-factor authentication enabled!");
		setStep("backup");
	};

	// ── Helpers ───────────────────────────────────────────
	const copyBackupCodes = () => {
		navigator.clipboard.writeText(backupCodes.join("\n"));
		toast.success("Backup codes copied!");
	};

	const downloadBackupCodes = () => {
		const text = `${MSG.APP_NAME} - 2FA Backup Codes\n${"=".repeat(30)}\n\n${backupCodes.join("\n")}\n\nEach code can only be used once.\nStore these in a safe place.`;
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "vibe-2fa-backup-codes.txt";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Codes downloaded!");
	};

	// ── QR code as an image via Google Charts API ─────────
	const qrImageUrl = totpURI
		? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpURI)}&bgcolor=0a0a0a&color=a78bfa`
		: "";

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

				{/* Progress indicator */}
				<div className="flex items-center justify-center gap-2 mb-8">
					{(["intro", "qr", "verify", "backup"] as const).map((s, i) => (
						<div key={s} className="flex items-center gap-2">
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
									step === s ||
									(
										["intro", "qr", "verify", "backup", "done"].indexOf(step) >
											i
									)
										? "bg-purple-600 text-white"
										: "bg-white/5 text-gray-600 border border-white/10"
								}`}
							>
								{["intro", "qr", "verify", "backup", "done"].indexOf(step) >
								i ? (
									<Check className="w-4 h-4" />
								) : (
									i + 1
								)}
							</div>
							{i < 3 && (
								<div
									className={`w-8 h-0.5 ${
										["intro", "qr", "verify", "backup", "done"].indexOf(step) >
										i
											? "bg-purple-600"
											: "bg-white/10"
									}`}
								/>
							)}
						</div>
					))}
				</div>

				{/* Card */}
				<div className="rounded-2xl bg-white/2 border border-white/6 p-8 backdrop-blur-sm">
					{/* ─── STEP: Intro ─── */}
					{step === "intro" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-6"
						>
							<div className="flex justify-center">
								<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500/15 to-cyan-500/15 flex items-center justify-center border border-purple-500/20">
									<Shield className="w-8 h-8 text-purple-400" />
								</div>
							</div>

							<div className="text-center">
								<h1 className="text-2xl font-bold text-white mb-2">
									Secure your account
								</h1>
								<p className="text-gray-500 text-sm leading-relaxed">
									Two-factor authentication adds an extra layer of security.
									You'll need your authenticator app each time you sign in.
								</p>
							</div>

							{/* Requirements */}
							<div className="space-y-3">
								<div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
									<Smartphone className="w-5 h-5 text-cyan-400 shrink-0" />
									<div>
										<p className="text-sm text-white font-medium">
											Authenticator app required
										</p>
										<p className="text-xs text-gray-500">
											Google Authenticator, Authy, or similar
										</p>
									</div>
								</div>
							</div>

							{/* Password confirmation */}
							<div className="space-y-2">
								<label
									htmlFor={passwordInputId}
									className="text-gray-300 text-sm font-medium"
								>
									Confirm your password
								</label>
								<Input
									id={passwordInputId}
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										setPasswordError("");
									}}
									className={`h-12 bg-white/3 ${passwordError ? "border-red-500" : "border-white/10"} text-white placeholder:text-gray-600 rounded-xl`}
								/>
								{passwordError && (
									<p className="text-xs text-red-400">{passwordError}</p>
								)}
							</div>

							<Button
								onClick={handleEnable2FA}
								disabled={isLoading}
								className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/25 group"
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<>
										Enable 2FA
										<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
									</>
								)}
							</Button>
						</motion.div>
					)}

					{/* ─── STEP: QR Code ─── */}
					{step === "qr" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-6"
						>
							<div className="text-center">
								<h1 className="text-2xl font-bold text-white mb-2">
									Scan QR code
								</h1>
								<p className="text-gray-500 text-sm">
									Open your authenticator app and scan this code
								</p>
							</div>

							{/* QR Code */}
							<div className="flex justify-center">
								<div className="p-4 bg-white rounded-2xl">
									<img
										src={qrImageUrl}
										alt="2FA QR Code"
										width={200}
										height={200}
										className="rounded-lg"
									/>
								</div>
							</div>

							{/* Secret key fallback */}
							<div className="space-y-2">
								<p className="text-xs text-gray-500 text-center">
									Can't scan? Enter this code manually:
								</p>
								<button
									type="button"
									onClick={() => {
										const secret =
											new URL(totpURI).searchParams.get("secret") || totpURI;
										navigator.clipboard.writeText(secret);
										toast.success("Secret copied!");
									}}
									className="w-full p-3 bg-white/3 border border-white/6 rounded-xl font-mono text-xs text-purple-400 text-center hover:bg-white/6 transition-all break-all"
								>
									{(() => {
										try {
											return new URL(totpURI).searchParams.get("secret") || "—";
										} catch {
											return "—";
										}
									})()}
									<ClipboardCopy className="w-3 h-3 inline ml-2 text-gray-500" />
								</button>
							</div>

							<Button
								onClick={() => setStep("verify")}
								className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl group"
							>
								I've scanned it
								<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
						</motion.div>
					)}

					{/* ─── STEP: Verify OTP ─── */}
					{step === "verify" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-6"
						>
							<div className="text-center">
								<h1 className="text-2xl font-bold text-white mb-2">
									Verify setup
								</h1>
								<p className="text-gray-500 text-sm">
									Enter the 6-digit code from your authenticator app
								</p>
							</div>

							{/* OTP Input */}
							<div className="space-y-2">
								<Input
									type="text"
									inputMode="numeric"
									maxLength={6}
									placeholder="000000"
									value={otp}
									onChange={(e) => {
										const val = e.target.value.replace(/\D/g, "").slice(0, 6);
										setOtp(val);
										setOtpError("");
									}}
									className={`h-16 bg-white/3 ${otpError ? "border-red-500" : "border-white/10"} text-white text-center text-3xl font-mono tracking-[0.5em] placeholder:text-gray-700 rounded-xl`}
									autoFocus
								/>
								{otpError && (
									<p className="text-xs text-red-400 text-center">{otpError}</p>
								)}
							</div>

							<div className="flex gap-3">
								<Button
									variant="outline"
									onClick={() => setStep("qr")}
									className="flex-1 h-12 bg-white/3 border-white/10 text-white hover:bg-white/6 rounded-xl"
								>
									<ArrowLeft className="w-4 h-4 mr-2" />
									Back
								</Button>
								<Button
									onClick={handleVerifyOTP}
									disabled={isLoading || otp.length !== 6}
									className="flex-1 h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl"
								>
									{isLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										"Verify"
									)}
								</Button>
							</div>
						</motion.div>
					)}

					{/* ─── STEP: Backup Codes ─── */}
					{step === "backup" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-6"
						>
							<div className="text-center">
								<h1 className="text-2xl font-bold text-white mb-2">
									Save backup codes
								</h1>
								<p className="text-gray-500 text-sm">
									Store these recovery codes in a safe place
								</p>
							</div>

							{/* Warning */}
							<div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
								<AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
								<div>
									<p className="text-amber-400 text-sm font-medium">
										You won't see these again!
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Each code can only be used once. If you lose access to your
										authenticator, these are your only way back in.
									</p>
								</div>
							</div>

							{/* Codes grid */}
							<div className="grid grid-cols-2 gap-2 p-4 bg-black/30 rounded-xl border border-white/10">
								{backupCodes.map((code, i) => (
									<div
										key={`${i}-${code}`}
										className="text-center text-purple-400 text-sm font-mono py-1"
									>
										{code}
									</div>
								))}
							</div>

							{/* Actions */}
							<div className="flex gap-3">
								<Button
									variant="outline"
									onClick={copyBackupCodes}
									className="flex-1 h-11 bg-white/3 border-white/10 text-white hover:bg-white/6 rounded-xl text-sm"
								>
									<ClipboardCopy className="w-4 h-4 mr-2" />
									Copy
								</Button>
								<Button
									variant="outline"
									onClick={downloadBackupCodes}
									className="flex-1 h-11 bg-white/3 border-white/10 text-white hover:bg-white/6 rounded-xl text-sm"
								>
									<Download className="w-4 h-4 mr-2" />
									Download
								</Button>
							</div>

							<Button
								onClick={() => setStep("done")}
								className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl group"
							>
								I've saved my codes
								<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
						</motion.div>
					)}

					{/* ─── STEP: Done ─── */}
					{step === "done" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-6 text-center"
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									type: "spring",
									stiffness: 200,
									damping: 15,
								}}
								className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20"
							>
								<CheckCircle2 className="w-10 h-10 text-emerald-400" />
							</motion.div>

							<div>
								<h1 className="text-2xl font-bold text-white mb-2">
									You're all set!
								</h1>
								<p className="text-gray-500 text-sm leading-relaxed">
									Two-factor authentication is now enabled. You'll be asked for
									a verification code each time you sign in.
								</p>
							</div>

							<Button
								onClick={() => navigate({ to: "/" })}
								className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl"
							>
								Go to Dashboard
							</Button>
						</motion.div>
					)}
				</div>

				{/* Footer */}
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
