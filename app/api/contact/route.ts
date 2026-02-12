import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generateEmailTemplate(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, rgba(91, 125, 214, 0.8), rgba(91, 125, 214, 0.3)); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Gradient Institute</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em;">New Contact Form Submission</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; background-color: rgba(91, 125, 214, 0.1); color: #4a6bc4; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">CONTACT US</span>
              </div>
              
              <h2 style="margin: 24px 0 16px 0; color: #2d2d2d; font-size: 24px; font-weight: 600;">You have received a new contact form submission</h2>
              
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin-top: 24px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #2d2d2d; font-size: 14px; display: block; margin-bottom: 4px;">Name:</strong>
                      <span style="color: #4a5568; font-size: 14px;">${data.name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #2d2d2d; font-size: 14px; display: block; margin-bottom: 4px;">Email:</strong>
                      <a href="mailto:${data.email}" style="color: #5b7dd6; font-size: 14px; text-decoration: none;">${data.email}</a>
                    </td>
                  </tr>
                  ${data.phone ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #2d2d2d; font-size: 14px; display: block; margin-bottom: 4px;">Phone:</strong>
                      <span style="color: #4a5568; font-size: 14px;">${data.phone}</span>
                    </td>
                  </tr>
                  ` : ''}
                  ${data.company ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #2d2d2d; font-size: 14px; display: block; margin-bottom: 4px;">Company:</strong>
                      <span style="color: #4a5568; font-size: 14px;">${data.company}</span>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 12px 0;">
                      <strong style="color: #2d2d2d; font-size: 14px; display: block; margin-bottom: 8px;">Message:</strong>
                      <div style="color: #4a5568; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #4a5568; font-size: 12px;">This email was sent from the Gradient Institute contact form.</p>
              <p style="margin: 8px 0 0 0; color: #4a5568; font-size: 12px;">© ${new Date().getFullYear()} Gradient Institute. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    // Validar campos requeridos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email para el destinatario
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@gradientinstitute.org";

    // Enviar email
    const info = await transporter.sendMail({
      from: `"Gradient Institute" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: generateEmailTemplate({
        name,
        email,
        phone,
        company,
        message,
      }),
    });

    console.log("Email sent:", info.messageId);

    return NextResponse.json(
      { message: "Email sent successfully", messageId: info.messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
