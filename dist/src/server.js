"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const newsletter_routes_1 = __importDefault(require("./routes/newsletter.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
// Security & Parsing Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [CLIENT_URL, "https://arthawebservices.dev", "http://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use("/api/health", health_routes_1.default);
app.use("/api/contact", contact_routes_1.default);
app.use("/api/newsletter", newsletter_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
// Fallback 404 for unknown endpoints
app.use((req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});
// Start Server
app.listen(PORT, () => {
    console.log(`⚡ [Artha Backend] Express API server running on http://localhost:${PORT}`);
    console.log(`🔒 [Artha Backend] Environment: ${process.env.NODE_ENV || "development"}`);
});
exports.default = app;
