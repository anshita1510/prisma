import cors from "cors";
import app from "../app";

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
)