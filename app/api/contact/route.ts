import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 },
      );
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address.' },
        { status: 400 },
      );
    }

    const { error } = await resend.emails.send({
      from: 'blakeziegler.app <onboarding@resend.dev>',
      to: 'blakerobertziegler@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f4f4f5;color:#111111;border-radius:8px;">
          <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#1A56FF;margin:0 0 24px;">blakeziegler.app — new message</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px;width:80px;">Name</td><td style="padding:8px 0;border-bottom:1px solid #e4e4e7;font-size:13px;color:#111111;">${name}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px;">Email</td><td style="padding:8px 0;border-bottom:1px solid #e4e4e7;font-size:13px;"><a href="mailto:${email}" style="color:#1A56FF;">${email}</a></td></tr>
          </table>
          <p style="font-size:15px;line-height:1.7;color:#333333;white-space:pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error('[contact] resend error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to send. Try again.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error.' },
      { status: 500 },
    );
  }
}
