"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash("admin@321", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@arthawebservices.dev" },
        update: {},
        create: {
            email: "admin@arthawebservices.dev",
            password: hashedPassword,
            role: "admin",
        },
    });
    console.log("Seeded admin user in backend:", admin.email);
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
