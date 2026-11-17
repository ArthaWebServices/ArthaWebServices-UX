"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeNewsletter = subscribeNewsletter;
const zod_1 = require("zod");
const prisma_service_1 = require("../services/prisma.service");
const newsletterSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
async function subscribeNewsletter(req, res) {
    try {
        const parseResult = newsletterSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: "Please provide a valid email address." });
        }
        const { email } = parseResult.data;
        try {
            await prisma_service_1.prisma.newsletterSubscriber.upsert({
                where: { email },
                update: { active: true },
                create: { email },
            });
        }
        catch (err) {
            console.warn("DB notice: Database not active locally.");
        }
        return res.status(200).json({
            success: true,
            message: "Subscribed to Artha Engineering Dispatch.",
        });
    }
    catch (error) {
        console.error("Newsletter error:", error);
        return res.status(500).json({ error: "Failed to process subscription." });
    }
}
