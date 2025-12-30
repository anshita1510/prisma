import { Router } from 'express';
import { UserController } from '../../controller/auth/auth.controller';
import { authenticate } from '../../../middlewares/auth.optional.middleware';

const router = Router();
const controller = new UserController();

router.post("/invite", authenticate, controller.inviteEmployee);
router.post("/login", controller.login);               //done
router.put("/update/:id", authenticate, controller.updateCredentials);    //done
router.post("/:id/setPassword", authenticate, controller.updatePassword); 


router.get("/profile", authenticate, (req, res)=>{
    res.json(req.user);
});

router.post("/super_admin", controller.createSuperAdmin);

router.post("/set-password", controller.setPassword);



export default router;