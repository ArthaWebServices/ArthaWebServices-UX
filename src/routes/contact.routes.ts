import { Router } from "express";
import { submitContactForm } from "../controllers/contact.controller";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/", rateLimiter(5, 60 * 60 * 1000), submitContactForm);

export default router;
