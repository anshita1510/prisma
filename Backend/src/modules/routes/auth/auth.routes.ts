
import { Router } from "express";
import { UserController } from "../../controller/auth/auth.controller";
import { inviteAuthMiddleware } from "../../../middlewares/inviteAuth.middleware";
import { authenticate } from "../../../middlewares/auth.middleware";
import { requireRole, requireAnyRole } from "../../../middlewares/role.middleware";
import { Role } from "@prisma/client";
import {forgotPassword} from "../../controller/password/forget.password.controller"
import { verifyOtp } from "../../controller/password/verify.password";
import { resetPassword } from "../../controller/password/reset.password.controller";

const router = Router();
const controller = new UserController();

/* ---------------- AUTH ---------------- */
router.post("/login", controller.login);
router.post("/check-user", controller.checkUser);
router.post("/google-login", controller.googleLogin);
router.post("/microsoft-login", controller.microsoftLogin);
router.post("/superAdmin", controller.createSuperAdmin);

/* ---------------- DEBUG ---------------- */
router.get(
    "/debug-test",
    authenticate,
    controller.debugTest
);

/* ---------------- AUTHENTICATED USER ---------------- */
router.post(
    "/register",
    authenticate,
    requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
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

router.get(
    "/",
    authenticate,
    requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
    controller.getAllUsers
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

/* ---------------- API DOCUMENTATION ---------------- */
router.get(
    "/api-docs",
    controller.getApiDocumentation
);

router.get(
    "/postman-collection",
    controller.downloadPostmanCollection
);

export default router;
