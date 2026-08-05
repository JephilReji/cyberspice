import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, otp: string) {
  const { error } = await resend.emails.send({
    from: "CyberSpice <onboarding@resend.dev>",
    to: email,
    subject: "Your CyberSpice Verification Code",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #173809; font-size: 24px; margin-bottom: 8px;">CyberSpice</h1>
        <p style="color: #5c5f60; margin-bottom: 24px;">The global B2B spice marketplace</p>
        <hr style="border: none; border-top: 1px solid #c3c8bb; margin-bottom: 24px;" />
        <h2 style="color: #141b2b; font-size: 20px; margin-bottom: 8px;">Verify your email address</h2>
        <p style="color: #5c5f60; margin-bottom: 24px;">
          Use the code below to verify your account. It expires in <strong>10 minutes</strong>.
        </p>
        <div style="background: #f1f3ff; border: 1px solid #c3c8bb; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px; font-weight: 700; letter-spacing: 12px; color: #173809;">${otp}</span>
        </div>
        <p style="color: #73796d; font-size: 14px;">
          If you didn't create a CyberSpice account, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send OTP email.");
  }
}
