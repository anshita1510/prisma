import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import userRoutes from "./modules/routes/auth/auth.routes";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
    console.log("Hello");
    return res.send("backend running");
});

app.use("/api/users", userRoutes);

const PORT= 5004;

app.listen(PORT, () => {
  // console.log(process.env.SMTP_HOST, process.env.SMTP_PORT);
  console.log(`Server running on port ${PORT}`);
});

