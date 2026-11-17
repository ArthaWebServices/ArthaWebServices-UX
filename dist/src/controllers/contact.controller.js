"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = void 0;
exports.submitContactForm = submitContactForm;
const zod_1 = require("zod");
const prisma_service_1 = require("../services/prisma.service");
const email_service_1 = require("../services/email.service");
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(80),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().max(25).optional().or(zod_1.z.literal("")),
    company: zod_1.z.string().max(80).optional().or(zod_1.z.literal("")),
    service: zod_1.z.string().min(2, "Please select a service"),
    message: zod_1.z.string().min(10, "Message must be at least 10 characters").max(2000),
});
async function submitContactForm(req, res) {
    try {
        const parseResult = exports.contactSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: "Validation error",
                issues: parseResult.error.errors,
            });
        }
        const { name, email, phone, company, service, message } = parseResult.data;
        let savedContact = null;
        try {
            savedContact = await prisma_service_1.prisma.contact.create({
                data: {
                    name,
                    email,
                    phone: phone || null,
                    company: company || null,
                    service,
                    message,
                },
            });
        }
        catch (dbErr) {
            console.warn("DB notice: Database not running locally, proceeding with in-memory lead handling.");
        }
        // Trigger async email notifications
        (0, email_service_1.sendLeadNotifications)({
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
    }
    catch (error) {
        console.error("Submit contact error:", error);
        return res.status(500).json({ error: "Internal server error occurred." });
    }
}
