import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

// export const optionalAuthMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return next();
//   }

//   if (!authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Invalid token format" });
//   }

//   try {
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cc7a1bdc1c78a0aa2b7312735c2aba79777877aabda3b08500d66196a17a8e1c') as {
//       id: number;
//       role: Role;
//     };
//     if (!decoded) {
//       return res.status(401).json({ error: "Invalid token" });
//     }
//     console.log('decoded----',decoded);

//     req.user = {
//       id: decoded.id,
//       role: decoded.role,
//     };

//     next();
//   } catch {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };

export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", req.headers.authorization);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // optional auth
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: Role;
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
