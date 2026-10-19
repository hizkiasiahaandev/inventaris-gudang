import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import { Role } from "../../generated/prisma/enums";

async function main() {
    const adminEmail = {
        name: "Administrator",
        email: "admin@gmail.com"
    }
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: adminEmail.email,
        },
    });

    if (existingAdmin) {
        console.log("Admin already exists");
        return;
    }
    const admin = await prisma.user.create({
        data: {
            name: adminEmail.name,
            email: adminEmail.email,
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });


    console.log("Admin created:", admin.email);
}


main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });