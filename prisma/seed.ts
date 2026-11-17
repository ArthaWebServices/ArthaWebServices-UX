import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin@321", 10);

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
