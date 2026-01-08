
import { Router } from "express";
import { UserController } from "../../controller/auth/auth.controller";
import { inviteAuthMiddleware } from "../../../middlewares/inviteAuth.middleware";
import { authenticate } from "../../../middlewares/auth.middleware";
import { requireRole } from "../../../middlewares/role.middleware";
import { Role } from "@prisma/client";
import {forgotPassword} from "../../controller/password/forget.password.controller"
import { verifyOtp } from "../../controller/password/verify.password";
import { resetPassword } from "../../controller/password/reset.password.controller";

const router = Router();
const controller = new UserController();

/* ---------------- AUTH ---------------- */
router.post("/login", controller.login);
router.post("/superAdmin", controller.createSuperAdmin);

/* ---------------- AUTHENTICATED USER ---------------- */
router.post(
    "/register",
    authenticate,
    requireRole(Role.ADMIN, Role.SUPER_ADMIN),
    controller.inviteEmployee
);

router.put(
    "/update/:id",
    authenticate,
    requireRole(Role.ADMIN),
    controller.updateCredentials
);

router.get(
    "/me",
    authenticate,
    controller.getCurrentUser
);

router.post(
    "/:id/update-password",
    authenticate,
    controller.updatePassword
);

/* ---------------- INVITE FLOW ---------------- */
router.post(
    "/set-password",
    controller.setPassword
);

router.post(
    "/resend-otp",
    inviteAuthMiddleware,
    controller.resendOtp
);

router.post(
    "/forgot-password",
    forgotPassword
)


router.post(
    "/verify-otp",
    verifyOtp

)
router.post(
    "/reset-password",
    resetPassword
)

export default router;
