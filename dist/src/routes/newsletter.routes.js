"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("../controllers/newsletter.controller");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.post("/", (0, rateLimiter_1.rateLimiter)(10, 60 * 60 * 1000), newsletter_controller_1.subscribeNewsletter);
exports.default = router;
