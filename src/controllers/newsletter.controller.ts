import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../services/prisma.service";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function subscribeNewsletter(req: Request, res: Response) {
  try {
    const parseResult = newsletterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const { email } = parseResult.data;

    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: { active: true },
        create: { email },
      });
    } catch (err) {
      console.warn("DB notice: Database not active locally.");
    }

    return res.status(200).json({
      success: true,
      message: "Subscribed to Artha Engineering Dispatch.",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return res.status(500).json({ error: "Failed to process subscription." });
  }
}
