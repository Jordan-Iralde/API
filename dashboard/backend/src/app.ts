import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routes } from "./routes/index";

const app = express();

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));

app.use(cookieParser());

app.use(express.json());

app.use("/api", routes);

export default app;