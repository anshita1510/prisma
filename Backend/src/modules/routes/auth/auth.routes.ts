
import { Router } from "express";
import { UserController } from "../../controller/auth/auth.controller";
import { inviteAuthMiddleware } from "../../../middlewares/inviteAuth.middleware";
import { authenticate } from "../../../middlewares/auth.middleware";
import { requireRole } from "../../../middlewares/role.middleware";
import { Role } from "@prisma/client";

const router = Router();
const controller = new UserController();

/* ---------------- AUTH ---------------- */
router.post("/login", controller.login);
router.post("/super_admin", controller.createSuperAdmin);

/* ---------------- AUTHENTICATED USER ---------------- */
router.post(
    "/register",
    authenticate,
    requireRole(Role.ADMIN, Role.SUPER_ADMIN),
    controller.inviteEmployee
);

// router.put(
//     "/update/:id",
//     authMiddleware,
//     requireRole(Role.ADMIN),
//     controller.updateCredentials
// );

router.get(
    "/profile",
    authenticate,
    (req, res) => res.json(req.user)
);

// router.post(
//     "/:id/update-password",
//     authMiddleware,
//     controller.updatePassword
// );

/* ---------------- INVITE FLOW ---------------- */
// router.post(
//     "/set-password",
//     inviteAuthMiddleware,
//     controller.setPassword
// );

// router.post(
//     "/resend-otp",
//     inviteAuthMiddleware,
//     controller.resendOtp
// );

export default router;
