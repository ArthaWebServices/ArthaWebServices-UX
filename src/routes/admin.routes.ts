import { Router } from "express";
import { adminLogin, getContacts, updateContactStatus } from "../controllers/admin.controller";
import { requireAdminAuth } from "../middleware/auth";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

// Stricter rate-limiting on login endpoint to prevent brute-force attacks (5 attempts per 15 minutes)
router.post("/login", rateLimiter(5, 15 * 60 * 1000), adminLogin);
router.get("/contacts", requireAdminAuth, getContacts);
router.patch("/contacts", requireAdminAuth, updateContactStatus);

export default router;
