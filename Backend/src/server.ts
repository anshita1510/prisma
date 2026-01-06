// import dotenv from "dotenv";
// dotenv.config(); 

// import express from "express"; 
// import leaveRouters from "./modules/routes/leave/leave.routes"
// import userRoutes from "./modules/routes/auth/auth.routes";
// import cors from "cors";

// const app = express();

// app.use(cors({ origin: "http://localhost:3000", credentials: true}));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (_req, res) => {
//     console.log("Hello");
//     return res.send("backend running");
// });

// app.use("/api/users", userRoutes);
// app.use("/leave", leaveRouters );

// const PORT= 5004;

// app.listen(PORT, () => {
//   // console.log(process.env.SMTP_HOST, process.env.SMTP_PORT);
//   console.log(`Server running on port ${PORT}`);
// });

// Backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/routes/auth/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', authRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});