"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Stricter rate-limiting on login endpoint to prevent brute-force attacks (5 attempts per 15 minutes)
router.post("/login", (0, rateLimiter_1.rateLimiter)(5, 15 * 60 * 1000), admin_controller_1.adminLogin);
router.get("/contacts", auth_1.requireAdminAuth, admin_controller_1.getContacts);
router.patch("/contacts", auth_1.requireAdminAuth, admin_controller_1.updateContactStatus);
exports.default = router;
