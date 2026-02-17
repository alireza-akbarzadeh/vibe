import { Resend } from "resend";
import { z } from "zod";

// Re-export all templates from the new branded template system
export {
	accountDeletedEmail,
	getEmailTemplate,
	newDeviceLoginEmail,
	otpCodeEmail,
	passwordResetEmail,
	subscriptionConfirmEmail,
	verificationEmail,
	welcomeVerifyEmail,
} from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

const EmailOptionsSchema = z.object({
	to: z.union([z.email(), z.array(z.string().email())]),
	subject: z.string().min(1).max(255),
	html: z.string().min(1),
	text: z.string().optional(),
	from: z.string().default("Your App <onboarding@resend.dev>"),
	cc: z.array(z.email()).optional(),
	reply_to: z.email().optional(),
	attachments: z
		.array(
			z.object({
				filename: z.string(),
				content: z.any().optional(),
				path: z.string().url().optional(),
			}),
		)
		.optional(),
	idempotencyKey: z.string().optional(),
});

type EmailOptions = z.infer<typeof EmailOptionsSchema>;

/**
 * Advanced Email Sender
 * Features: Validation, Idempotency, Detailed Error Catching
 */
export async function sendEmail(options: EmailOptions) {
	try {
		// 1. Validate Input
		const validatedData = EmailOptionsSchema.parse(options);

		// 2. Send via Resend
		const { data, error } = await resend.emails.send(
			{
				from: validatedData.from,
				to: validatedData.to,
				subject: validatedData.subject,
				html: validatedData.html,
				text: validatedData.text,
				cc: validatedData.cc,
				replyTo: validatedData.reply_to,
				attachments: validatedData.attachments,
			},
			{
				idempotencyKey: validatedData.idempotencyKey,
			},
		);

		if (error) {
			console.error(`[Resend Error]: ${error.name} - ${error.message}`);
			return { success: false, error };
		}

		console.log(`[Email Sent]: ID ${data?.id}`);
		return { success: true, id: data?.id };
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.error("[Validation Error]:", err.issues);
			return { success: false, error: "Invalid email parameters" };
		}

		console.error("[Unexpected Error]:", err);
		return { success: false, error: "Internal Server Error" };
	}
}
