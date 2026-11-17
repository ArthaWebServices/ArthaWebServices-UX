"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.post("/", (0, rateLimiter_1.rateLimiter)(5, 60 * 60 * 1000), contact_controller_1.submitContactForm);
exports.default = router;
