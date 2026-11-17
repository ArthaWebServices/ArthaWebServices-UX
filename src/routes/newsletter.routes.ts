import { Router } from "express";
import { subscribeNewsletter } from "../controllers/newsletter.controller";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/", rateLimiter(10, 60 * 60 * 1000), subscribeNewsletter);

export default router;
