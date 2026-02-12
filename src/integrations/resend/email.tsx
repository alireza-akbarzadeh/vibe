import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const EmailOptionsSchema = z.object({
    to: z.union([z.email(), z.array(z.string().email())]),
    subject: z.string().min(1).max(255),
    html: z.string().min(1),
    text: z.string().optional(),
    from: z.string().default('Your App <onboarding@resend.dev>'),
    cc: z.array(z.email()).optional(),
    reply_to: z.email().optional(),
    attachments: z.array(z.object({
        filename: z.string(),
        content: z.any().optional(),
        path: z.string().url().optional(),
    })).optional(),
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
        const { data, error } = await resend.emails.send({
            from: validatedData.from,
            to: validatedData.to,
            subject: validatedData.subject,
            html: validatedData.html,
            text: validatedData.text,
            cc: validatedData.cc,
            replyTo: validatedData.reply_to,
            attachments: validatedData.attachments,
        }, {
            idempotencyKey: validatedData.idempotencyKey,
        });

        if (error) {
            console.error(`[Resend Error]: ${error.name} - ${error.message}`);
            return { success: false, error };
        }

        console.log(`[Email Sent]: ID ${data?.id}`);
        return { success: true, id: data?.id };

    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('[Validation Error]:', err.issues);
            return { success: false, error: 'Invalid email parameters' };
        }

        console.error('[Unexpected Error]:', err);
        return { success: false, error: 'Internal Server Error' };
    }
}


export const getEmailTemplate = ({
    title,
    message,
    buttonText,
    buttonUrl,
    heroImage = "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80" // Default modern gradient image
}: {
    title: string,
    message: string,
    buttonText: string,
    buttonUrl: string,
    heroImage?: string
}) => {
    return `<!init-type html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
        
        body { margin: 0; padding: 0; width: 100%; background-color: #F8FAFC; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; border-spacing: 0; }
        img { border: 0; line-height: 100%; outline: none; text-decoration: none; display: block; }
        
        .email-wrapper { width: 100%; background-color: #F8FAFC; padding: 40px 10px; }
        .email-content { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); }
        
        .hero-image { width: 100%; height: 200px; object-fit: cover; }
        
        .body-padding { padding: 40px 48px; font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif; }
        
        .badge { display: inline-block; padding: 6px 12px; background: #EEF2FF; color: #4F46E5; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; }
        
        h1 { color: #1E293B; font-size: 28px; font-weight: 700; line-height: 1.2; margin: 0 0 16px; }
        p { color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px; }
        
        .button-container { padding-top: 10px; }
        .btn { background-color: #4F46E5; color: #ffffff !important; padding: 16px 32px; border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s; }
        
        .footer { padding: 32px 48px; background-color: #F1F5F9; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif; }
        .footer-text { color: #64748B; font-size: 13px; line-height: 1.5; }
        .social-links { margin-top: 16px; }
        .social-links a { color: #94A3B8; text-decoration: none; margin: 0 8px; font-size: 12px; font-weight: 600; }

        @media (max-width: 600px) {
            .body-padding { padding: 32px 24px; }
            h1 { font-size: 24px; }
            .email-content { border-radius: 16px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <table class="email-content" role="presentation">
            <tr>
                <td>
                    <img src="${heroImage}" alt="Header Image" class="hero-image">
                </td>
            </tr>
            
            <tr>
                <td class="body-padding">
                    <span class="badge">Notification</span>
                    <h1>${title}</h1>
                    <p>${message}</p>
                    
                    <div class="button-container">
                        <a href="${buttonUrl}" class="btn">${buttonText}</a>
                    </div>
                </td>
            </tr>
            
            <tr>
                <td class="footer">
                    <p class="footer-text">
                        © ${new Date().getFullYear()} Your Brand. All rights reserved.<br>
                        123 Tech Avenue, Silicon Valley, CA 94043
                    </p>
                    <div class="social-links">
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                        <a href="#">LinkedIn</a>
                    </div>
                    <div style="margin-top: 20px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
                        <a href="#" style="color: #94A3B8; font-size: 12px;">Unsubscribe from these alerts</a>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
};