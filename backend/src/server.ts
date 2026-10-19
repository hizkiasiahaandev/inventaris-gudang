
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware";
import routes from "./routes/index";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://10.142.181.37:5173",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`Origin tidak diizinkan: ${origin}`));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);
app.use(errorMiddleware);

export default app;
