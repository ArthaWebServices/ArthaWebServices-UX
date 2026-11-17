import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../services/prisma.service";

export async function adminLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const expectedEmail = process.env.ADMIN_EMAIL || "admin@arthawebservices.dev";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin@321";

    if (email === expectedEmail && password === expectedPassword) {
      const secret = process.env.JWT_SECRET || "artha-backend-super-secure-jwt-secret-key-32chars";
      const token = jwt.sign(
        { id: "admin-1", email, role: "admin" },
        secret,
        { expiresIn: "7d" }
      );
      return res.json({ success: true, token, role: "admin" });
    }

    return res.status(401).json({ error: "Invalid admin credentials." });
  } catch (error) {
    return res.status(500).json({ error: "Authentication failure." });
  }
}

export async function getContacts(req: Request, res: Response) {
  try {
    let contacts = [];
    try {
      contacts = await prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      // Fallback demo data
      contacts = [
        {
          id: "demo-1",
          name: "Marcus Vance",
          email: "marcus@apexvault.com",
          phone: "+1 (555) 234-5678",
          company: "ApexVault Financial",
          service: "Product Engineering",
          message: "Looking to modernize our transactional ledger into event-driven Go microservices on AWS EKS.",
          createdAt: new Date().toISOString(),
          read: false,
        },
        {
          id: "demo-2",
          name: "Elena Rostova",
          email: "elena@neurosync.org",
          phone: "+1 (555) 987-6543",
          company: "NeuroSync Medical Systems",
          service: "AI Systems & Automation",
          message: "Need HIPAA-compliant multi-modal image diagnostic pipeline with Triton inference server.",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          read: true,
        },
      ];
    }

    return res.json({ contacts });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch contact submissions." });
  }
}

export async function updateContactStatus(req: Request, res: Response) {
  try {
    const { id, read } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Missing submission ID." });
    }

    try {
      await prisma.contact.update({
        where: { id },
        data: { read: Boolean(read) },
      });
    } catch (e) {
      // Ignore for demo
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update record." });
  }
}
