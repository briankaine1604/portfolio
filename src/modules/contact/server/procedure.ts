// server/routers/contact.ts
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const contactRouter = createTRPCRouter({
  sendEmail: baseProcedure.input(contactSchema).mutation(async ({ input }) => {
    try {
      // Create transporter using Zoho SMTP
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.ZOHO_EMAIL,
          pass: process.env.ZOHO_APP_PASSWORD,
        },
      });

      // Email to you (notification)
      const adminMailOptions = {
        from: process.env.ZOHO_EMAIL,
        to: "info@briankaine.com",
        subject: `New Contact Form Submission: ${input.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">New Contact Form Submission</h2>
              
              <div style="margin: 20px 0;">
                <strong>Name:</strong> ${input.name}
              </div>
              
              <div style="margin: 20px 0;">
                <strong>Email:</strong> ${input.email}
              </div>
              
              <div style="margin: 20px 0;">
                <strong>Subject:</strong> ${input.subject}
              </div>
              
              <div style="margin: 20px 0;">
                <strong>Message:</strong>
                <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; margin-top: 10px;">
                  ${input.message.replace(/\n/g, "<br>")}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
                <p>This email was sent from your contact form on briankaine.com</p>
                <p>Submitted at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `,
      };

      // Auto-reply email to the sender
      const autoReplyMailOptions = {
        from: process.env.ZOHO_EMAIL,
        to: input.email,
        subject: "Thanks for reaching out! - Brian Kaine",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">Thanks for reaching out!</h2>
              
              <p>Hi ${input.name},</p>
              
              <p>Thank you for your message regarding "<strong>${
                input.subject
              }</strong>". I've received your inquiry and will get back to you as soon as possible.</p>
              
              <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #84cc16; margin: 20px 0;">
                <p><strong>Your message:</strong></p>
                <p style="margin: 10px 0;">${input.message.replace(
                  /\n/g,
                  "<br>"
                )}</p>
              </div>
              
              <p>In the meantime, feel free to check out my work on my website or connect with me on:</p>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 5px 0;">💼 <a href="https://www.linkedin.com/in/brian-ikeogu-876023199/" style="color: #333;">LinkedIn</a></li>
              </ul>
              
              <p>Looking forward to connecting!</p>
              
              <p>Best regards,<br>
              <strong>Brian Kaine</strong><br>
              Full Stack Developer<br>
              Port Harcourt / Lagos, Nigeria</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p>This is an automated response. Please don't reply to this email.</p>
              </div>
            </div>
          `,
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(autoReplyMailOptions),
      ]);

      return {
        success: true,
        message: "Emails sent successfully",
      };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email. Please try again.");
    }
  }),
});
