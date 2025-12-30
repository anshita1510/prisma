import { Router } from 'express';
import { UserController } from '../../controller/auth/auth.controller';
import { optionalAuthMiddleware } from '../../../middlewares/auth.optional.middleware';

const router = Router();
const controller = new UserController();

router.post("/invite", optionalAuthMiddleware, controller.inviteEmployee);
router.post("/login", controller.login);               //done
router.put("/update/:id", optionalAuthMiddleware, controller.updateCredentials);    //done
router.post("/:id/setPassword", optionalAuthMiddleware, controller.updatePassword); 
router.get("/details",(req,res)=>{
    res.json({users: ["ansh", "a", "b"]});
});
router.get("/profile", optionalAuthMiddleware, (req, res)=>{
    res.json(req.user);
}); //done

export default router;