import nodemailer from "nodemailer";

export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || pass.includes("password")) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    connectionTimeout: 3000,
    auth: { user, pass },
  });
}

export async function sendLeadNotifications(data: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service: string;
  message: string;
}) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.log(`[Email Mock Dispatch] Notification for ${data.name} (${data.email}) regarding ${data.service}`);
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@arthawebservices.dev";

  try {
    // Email to Admin
    await transporter.sendMail({
      from: `"Artha Web Services" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `⚡ New Architecture Request: ${data.service} - ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "N/A"}\nCompany: ${data.company || "N/A"}\nService: ${data.service}\n\nMessage:\n${data.message}`,
    });

    // Auto-Reply to Inquirer
    await transporter.sendMail({
      from: `"Artha Web Services" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: "Your architecture inquiry has been received | Artha Web Services",
      text: `Hi ${data.name},\n\nThank you for reaching out to Artha Web Services. Our Principal Solutions Architects are reviewing your requirements regarding ${data.service} and will be in touch shortly.\n\nWarm regards,\nArtha Web Services Team\nhttps://arthawebservices.dev`,
    });
  } catch (err) {
    console.warn("Email service notice:", err);
  }
}
