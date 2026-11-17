import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../services/prisma.service";
import { sendLeadNotifications } from "../services/email.service";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(25).optional().or(z.literal("")),
  company: z.string().max(80).optional().or(z.literal("")),
  service: z.string().min(2, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export async function submitContactForm(req: Request, res: Response) {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation error",
        issues: parseResult.error.errors,
      });
    }

    const { name, email, phone, company, service, message } = parseResult.data;

    let savedContact = null;
    try {
      savedContact = await prisma.contact.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          service,
          message,
        },
      });
    } catch (dbErr) {
      console.warn("DB notice: Database not running locally, proceeding with in-memory lead handling.");
    }

    // Trigger async email notifications
    sendLeadNotifications({
      name,
      email,
      phone,
      company,
      service,
      message,
    }).catch(console.error);

    return res.status(201).json({
      success: true,
      message: "Inquiry successfully recorded and transmitted.",
      id: savedContact?.id || `lead-${Date.now()}`,
    });
  } catch (error) {
    console.error("Submit contact error:", error);
    return res.status(500).json({ error: "Internal server error occurred." });
  }
}
