import "dotenv/config.js";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

export const ENV =  {
    PORT: Number(process.env.PORT) || 3000,
    DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET!,
      NODE_ENV: process.env.NODE_ENV || "development"
};

