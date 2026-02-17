// ─── Vibe Streaming App — Branded Email Templates ──────────────

const BRAND = {
	name: "Vibe",
	tagline: "Your world. Your vibe.",
	url: process.env.VITE_APP_URL || "http://localhost:3000",
	logo: "https://img.icons8.com/fluency/96/play-button-circled.png",
	primaryColor: "#8B5CF6",
	primaryGradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
	dark: "#0a0a0a",
	darkCard: "#111111",
	border: "#1e1e1e",
	textPrimary: "#ffffff",
	textSecondary: "#a1a1aa",
	textMuted: "#52525b",
	year: new Date().getFullYear(),
};

function baseLayout(content: string, preheader = "") {
	return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="x-apple-disable-message-reformatting">
	<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
	<title>${BRAND.name}</title>
	<!--[if mso]>
	<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
	<![endif]-->
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
		@media (max-width: 600px) {
			.container { width: 100% !important; padding: 16px !important; }
			.inner { padding: 32px 24px !important; }
			.cta-btn { padding: 14px 28px !important; font-size: 15px !important; }
		}
	</style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.dark};">
	${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ""}
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.dark};padding:40px 16px;">
		<tr><td align="center">
			<table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
				<!-- Logo -->
				<tr><td align="center" style="padding-bottom:32px;">
					<a href="${BRAND.url}" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px;">
						<img src="${BRAND.logo}" alt="${BRAND.name}" width="40" height="40" style="border-radius:12px;" />
						<span style="font-size:24px;font-weight:700;color:${BRAND.textPrimary};letter-spacing:-0.5px;">${BRAND.name}</span>
					</a>
				</td></tr>

				<!-- Card -->
				<tr><td>
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.darkCard};border:1px solid ${BRAND.border};border-radius:20px;overflow:hidden;">
						<tr><td class="inner" style="padding:44px 40px;">
							${content}
						</td></tr>
					</table>
				</td></tr>

				<!-- Footer -->
				<tr><td style="padding-top:32px;text-align:center;">
					<p style="font-size:12px;color:${BRAND.textMuted};line-height:1.6;margin:0;">
						&copy; ${BRAND.year} ${BRAND.name}. ${BRAND.tagline}<br/>
						You're receiving this because you have an account on ${BRAND.name}.
					</p>
					<p style="margin-top:12px;">
						<a href="${BRAND.url}/terms" style="color:${BRAND.textMuted};font-size:11px;text-decoration:none;margin:0 8px;">Terms</a>
						<a href="${BRAND.url}/privacy" style="color:${BRAND.textMuted};font-size:11px;text-decoration:none;margin:0 8px;">Privacy</a>
						<a href="${BRAND.url}/help-center" style="color:${BRAND.textMuted};font-size:11px;text-decoration:none;margin:0 8px;">Help</a>
					</p>
				</td></tr>
			</table>
		</td></tr>
	</table>
</body>
</html>`;
}

function ctaButton(text: string, url: string) {
	return `
	<table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px auto 0;">
		<tr><td align="center" style="border-radius:14px;background:${BRAND.primaryGradient};">
			<a href="${url}" class="cta-btn" target="_blank" style="display:inline-block;padding:16px 40px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:14px;">
				${text} &rarr;
			</a>
		</td></tr>
	</table>`;
}

function heading(text: string) {
	return `<h1 style="font-size:26px;font-weight:700;color:${BRAND.textPrimary};line-height:1.3;margin:0 0 12px;">${text}</h1>`;
}

function paragraph(text: string) {
	return `<p style="font-size:15px;color:${BRAND.textSecondary};line-height:1.7;margin:0 0 20px;">${text}</p>`;
}

function divider() {
	return `<hr style="border:none;border-top:1px solid ${BRAND.border};margin:28px 0;" />`;
}

function securityNote(text: string) {
	return `
	${divider()}
	<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
		<tr>
			<td width="20" valign="top" style="padding-top:2px;">
				<span style="font-size:14px;">🔒</span>
			</td>
			<td style="padding-left:8px;">
				<p style="font-size:12px;color:${BRAND.textMuted};line-height:1.5;margin:0;">${text}</p>
			</td>
		</tr>
	</table>`;
}

// ─── Template: Welcome / Verify Email ───────────────────────────

export function welcomeVerifyEmail(userName: string, verifyUrl: string) {
	return baseLayout(
		`
		<div style="text-align:center;margin-bottom:28px;">
			<div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2));line-height:64px;font-size:28px;">
				🎬
			</div>
		</div>
		${heading(`Welcome to ${BRAND.name}, ${userName}!`)}
		${paragraph("We're thrilled to have you. Verify your email to unlock unlimited streaming — movies, music, shows, and more.")}

		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
			<tr>
				<td style="padding:12px 16px;background:rgba(139,92,246,0.08);border-radius:12px;border:1px solid rgba(139,92,246,0.15);">
					<table role="presentation" cellpadding="0" cellspacing="0">
						<tr>
							<td style="padding-right:12px;font-size:18px;vertical-align:middle;">✨</td>
							<td style="font-size:13px;color:${BRAND.textSecondary};line-height:1.5;">
								<strong style="color:${BRAND.textPrimary};">Unlimited content</strong> · Personalized recommendations · Multi-device streaming
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>

		${ctaButton("Verify My Email", verifyUrl)}
		${securityNote("This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.")}
		`,
		`Welcome to ${BRAND.name}! Verify your email to start streaming.`,
	);
}

// ─── Template: Email Verification (resend) ──────────────────────

export function verificationEmail(verifyUrl: string) {
	return baseLayout(
		`
		${heading("Verify your email")}
		${paragraph("Tap the button below to confirm your email address and activate your account.")}
		${ctaButton("Verify Email", verifyUrl)}
		${securityNote("This link expires in 24 hours. If you didn't request this, no action is needed.")}
		`,
		"Verify your email address for Vibe",
	);
}

// ─── Template: Password Reset ───────────────────────────────────

export function passwordResetEmail(resetUrl: string) {
	return baseLayout(
		`
		<div style="text-align:center;margin-bottom:28px;">
			<div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15));line-height:64px;font-size:28px;">
				🔑
			</div>
		</div>
		${heading("Reset your password")}
		${paragraph("We received a request to reset the password for your account. Click the button below to choose a new password.")}
		${ctaButton("Reset Password", resetUrl)}
		${divider()}
		${paragraph("If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.")}
		${securityNote("This link is valid for 1 hour and can only be used once.")}
		`,
		"Reset your Vibe password",
	);
}

// ─── Template: OTP Code ─────────────────────────────────────────

export function otpCodeEmail(otp: string) {
	return baseLayout(
		`
		<div style="text-align:center;margin-bottom:28px;">
			<div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2));line-height:64px;font-size:28px;">
				🔐
			</div>
		</div>
		${heading("Your verification code")}
		${paragraph("Enter this code to verify your identity. It expires in 10 minutes.")}

		<div style="text-align:center;margin:32px 0;">
			<div style="display:inline-block;padding:20px 48px;background:${BRAND.dark};border:2px solid ${BRAND.border};border-radius:16px;">
				<span style="font-size:36px;font-weight:700;letter-spacing:12px;color:${BRAND.textPrimary};font-family:'Courier New',monospace;">${otp}</span>
			</div>
		</div>

		${paragraph("Copy the code above and paste it in the verification screen.")}
		${securityNote(`Never share this code with anyone. ${BRAND.name} staff will never ask for your code.`)}
		`,
		`Your ${BRAND.name} verification code is ${otp}`,
	);
}

// ─── Template: Login from new device ────────────────────────────

export function newDeviceLoginEmail(deviceInfo: {
	browser: string;
	os: string;
	ip: string;
	location?: string;
	time: string;
}) {
	return baseLayout(
		`
		<div style="text-align:center;margin-bottom:28px;">
			<div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg, rgba(234,179,8,0.15), rgba(249,115,22,0.15));line-height:64px;font-size:28px;">
				📱
			</div>
		</div>
		${heading("New sign-in detected")}
		${paragraph("We noticed a login to your account from a new device. If this was you, no action is needed.")}

		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:${BRAND.dark};border:1px solid ${BRAND.border};border-radius:14px;overflow:hidden;">
			<tr>
				<td style="padding:16px 20px;border-bottom:1px solid ${BRAND.border};">
					<span style="font-size:12px;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:0.05em;">Device</span><br/>
					<span style="font-size:14px;color:${BRAND.textPrimary};font-weight:500;">${deviceInfo.browser} on ${deviceInfo.os}</span>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 20px;border-bottom:1px solid ${BRAND.border};">
					<span style="font-size:12px;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:0.05em;">Location</span><br/>
					<span style="font-size:14px;color:${BRAND.textPrimary};font-weight:500;">${deviceInfo.location || "Unknown"} (${deviceInfo.ip})</span>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 20px;">
					<span style="font-size:12px;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:0.05em;">Time</span><br/>
					<span style="font-size:14px;color:${BRAND.textPrimary};font-weight:500;">${deviceInfo.time}</span>
				</td>
			</tr>
		</table>

		${paragraph("If this wasn't you, secure your account immediately.")}
		${ctaButton("Secure My Account", `${BRAND.url}/forgot-password`)}
		`,
		"New login to your Vibe account",
	);
}

// ─── Template: Account Deleted ──────────────────────────────────

export function accountDeletedEmail(userName: string) {
	return baseLayout(
		`
		${heading(`Goodbye, ${userName}`)}
		${paragraph("Your Vibe account has been permanently deleted as requested. All your data, watchlists, and preferences have been removed.")}
		${paragraph("We're sorry to see you go. If you ever want to come back, you can create a new account anytime.")}
		${divider()}
		<p style="font-size:13px;color:${BRAND.textMuted};line-height:1.6;margin:0;">
			If you didn't request this deletion, please contact our support team immediately at
			<a href="mailto:support@vibeapp.com" style="color:${BRAND.primaryColor};text-decoration:none;">support@vibeapp.com</a>
		</p>
		`,
		"Your Vibe account has been deleted",
	);
}

// ─── Template: Subscription Confirmation ────────────────────────

export function subscriptionConfirmEmail(
	planName: string,
	nextBillingDate: string,
) {
	return baseLayout(
		`
		<div style="text-align:center;margin-bottom:28px;">
			<div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2));line-height:64px;font-size:28px;">
				🎉
			</div>
		</div>
		${heading(`You're on the ${planName} plan!`)}
		${paragraph("Your subscription is now active. Enjoy all the premium features Vibe has to offer.")}

		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:${BRAND.dark};border:1px solid ${BRAND.border};border-radius:14px;">
			<tr>
				<td style="padding:16px 20px;border-bottom:1px solid ${BRAND.border};">
					<span style="font-size:12px;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:0.05em;">Plan</span><br/>
					<span style="font-size:15px;color:${BRAND.textPrimary};font-weight:600;">${planName}</span>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 20px;">
					<span style="font-size:12px;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:0.05em;">Next billing date</span><br/>
					<span style="font-size:15px;color:${BRAND.textPrimary};font-weight:600;">${nextBillingDate}</span>
				</td>
			</tr>
		</table>

		${ctaButton("Start Watching", BRAND.url)}
		`,
		`Your ${planName} subscription is active!`,
	);
}

// ─── Backward-compatible wrapper ────────────────────────────────
// Replaces the old getEmailTemplate for any remaining callers

export function getEmailTemplate({
	title,
	message,
	buttonText,
	buttonUrl,
}: {
	title: string;
	message: string;
	buttonText: string;
	buttonUrl: string;
	heroImage?: string;
}) {
	return baseLayout(
		`
		${heading(title)}
		${paragraph(message)}
		${ctaButton(buttonText, buttonUrl)}
		`,
	);
}
