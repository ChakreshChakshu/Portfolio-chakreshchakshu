import { Resend } from 'resend';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters long').max(1000, 'Message must be under 1000 characters'),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Server-side Zod validation
    const parsedData = contactSchema.safeParse(body);
    if (!parsedData.success) {
      const errorMsg = parsedData.error.errors.map(err => err.message).join(', ');
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { firstName, lastName, email, message } = parsedData.data;

    const recipient = process.env.NEXT_PUBLIC_EMAIL || 'chakreshchakshu@gmail.com';

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: recipient,
      subject: `New Portfolio Message from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #FF312E; border-bottom: 2px solid #FF312E; padding-bottom: 8px; margin-top: 0;">New Contact Form Submission</h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #FF312E;">${email}</a></p>
          <p style="margin: 20px 0 5px 0;"><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FF312E; border-radius: 4px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0 15px 0;" />
          <p style="font-size: 11px; color: #999; margin: 0;">Sent via Portfolio Contact Form Route</p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
